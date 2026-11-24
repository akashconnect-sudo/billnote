import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getControlDb } from '@billnote/db'
import { Client } from 'pg'
import { RedisService } from '../redis/redis.service.js'

const QUEUE_KEY = 'bn:queue:provision'
const TENANT_TARGET_VERSION = 1

@Injectable()
export class ProvisionQueue implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProvisionQueue.name)
  private stopped = false
  private loop?: Promise<void>

  constructor(@Inject(RedisService) private readonly redis: RedisService) {}

  async onModuleInit() {
    this.loop = this.runLoop()
  }

  async onModuleDestroy() {
    this.stopped = true
    await this.loop
  }

  async enqueue(businessId: string): Promise<void> {
    await this.redis.raw.lpush(QUEUE_KEY, JSON.stringify({ businessId }))
    await this.redis.setJson(
      `bn:job:provision:${businessId}`,
      { status: 'queued', at: new Date().toISOString() },
      60 * 60 * 24,
    )
  }

  private async runLoop() {
    await this.redis.connect()
    while (!this.stopped) {
      try {
        const item = await this.redis.raw.brpop(QUEUE_KEY, 2)
        if (!item) continue
        const payload = JSON.parse(item[1]) as { businessId: string }
        await this.process(payload.businessId)
      } catch (error) {
        this.logger.error(error instanceof Error ? error.message : String(error))
        await new Promise((r) => setTimeout(r, 1000))
      }
    }
  }

  private async process(businessId: string) {
    const db = getControlDb()
    const business = await db.business.findUniqueOrThrow({ where: { id: businessId } })
    await this.redis.setJson(
      `bn:job:provision:${businessId}`,
      { status: 'running', at: new Date().toISOString() },
      60 * 60 * 24,
    )

    try {
      await this.createDatabaseIfNeeded(business.databaseName)
      await this.applyTenantMigrations(business.databaseName)

      await db.tenantMigrationState.upsert({
        where: { businessId },
        create: {
          businessId,
          currentVersion: TENANT_TARGET_VERSION,
          targetVersion: TENANT_TARGET_VERSION,
          status: 'idle',
        },
        update: {
          currentVersion: TENANT_TARGET_VERSION,
          targetVersion: TENANT_TARGET_VERSION,
          status: 'idle',
          lastError: null,
        },
      })

      await db.business.update({
        where: { id: businessId },
        data: { status: 'ready', schemaVersion: TENANT_TARGET_VERSION },
      })

      await this.redis.setJson(
        `bn:job:provision:${businessId}`,
        { status: 'ready', at: new Date().toISOString() },
        60 * 60 * 24,
      )
      this.logger.log(`Provisioned ${businessId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown provision error'
      await db.business.update({
        where: { id: businessId },
        data: { status: 'failed' },
      })
      await db.tenantMigrationState.upsert({
        where: { businessId },
        create: {
          businessId,
          currentVersion: 0,
          targetVersion: TENANT_TARGET_VERSION,
          status: 'failed',
          lastError: message,
        },
        update: { status: 'failed', lastError: message },
      })
      await this.redis.setJson(
        `bn:job:provision:${businessId}`,
        { status: 'failed', error: message, at: new Date().toISOString() },
        60 * 60 * 24,
      )
      this.logger.error(`Provision failed for ${businessId}: ${message}`)
    }
  }

  private adminUrl(): string {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL missing')
    const parsed = new URL(url)
    parsed.pathname = '/postgres'
    return parsed.toString()
  }

  private tenantUrl(databaseName: string): string {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL missing')
    const parsed = new URL(url)
    parsed.pathname = `/${databaseName}`
    return parsed.toString()
  }

  private async createDatabaseIfNeeded(databaseName: string): Promise<void> {
    const client = new Client({ connectionString: this.adminUrl() })
    await client.connect()
    try {
      const exists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [
        databaseName,
      ])
      if (exists.rowCount === 0) {
        await client.query(`CREATE DATABASE "${databaseName}" OWNER billnote`)
      }
    } finally {
      await client.end()
    }
  }

  private async applyTenantMigrations(databaseName: string): Promise<void> {
    const here = path.dirname(fileURLToPath(import.meta.url))
    const sqlPath = path.resolve(here, '../../../../docs/design/schema/tenant.sql')
    const sql = await readFile(sqlPath, 'utf8')
    const checksum = createHash('sha256').update(sql).digest('hex')

    const client = new Client({ connectionString: this.tenantUrl(databaseName) })
    await client.connect()
    try {
      const applied = await client
        .query(`SELECT checksum FROM schema_migrations WHERE version = 1`)
        .catch(() => ({ rowCount: 0, rows: [] as Array<{ checksum: string }> }))

      if (applied.rowCount && applied.rows[0]?.checksum === checksum) return
      if (applied.rowCount && applied.rows[0]?.checksum !== checksum) {
        throw new Error('Tenant V0001 checksum mismatch')
      }

      await client.query(sql)
      await client.query(
        `INSERT INTO schema_migrations (version, name, checksum) VALUES (1, 'V0001__init', $1)
         ON CONFLICT (version) DO UPDATE SET checksum = EXCLUDED.checksum`,
        [checksum],
      )
    } finally {
      await client.end()
    }
  }
}
