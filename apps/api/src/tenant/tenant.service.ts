import { Injectable } from '@nestjs/common'
import { getControlDb } from '@billnote/db'
import { Client } from 'pg'
import { fail } from '../common/envelope.js'

export type TenantContext = {
  businessId: string
  legalName: string
  displayName: string
  categoryKey: string
  userId: string
}

@Injectable()
export class TenantService {
  private tenantUrl(databaseName: string): string {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL missing')
    const parsed = new URL(url)
    parsed.pathname = `/${databaseName}`
    return parsed.toString()
  }

  async withTenantClient<T>(
    userId: string,
    businessId: string | undefined,
    run: (client: Client, ctx: TenantContext) => Promise<T>,
  ): Promise<T | ReturnType<typeof fail>> {
    const membership = businessId
      ? await getControlDb().membership.findFirst({
          where: { userId, businessId, status: 'active' },
          include: { business: true },
        })
      : await getControlDb().membership.findFirst({
          where: { userId, status: 'active', isDefault: true },
          include: { business: true },
        })

    if (!membership) {
      return fail('TENANT_REQUIRED', 'Create or select a shop first.')
    }
    if (membership.business.status !== 'ready') {
      return fail(
        'TENANT_NOT_READY',
        'This shop is still being set up. Please wait a moment.',
      )
    }

    const ctx: TenantContext = {
      businessId: membership.businessId,
      legalName: membership.business.legalName,
      displayName: membership.business.displayName,
      categoryKey: membership.business.categoryKey,
      userId,
    }

    const client = new Client({
      connectionString: this.tenantUrl(membership.business.databaseName),
    })
    await client.connect()
    try {
      await this.ensureShopReady(client, ctx)
      return await run(client, ctx)
    } finally {
      await client.end()
    }
  }

  private async ensureShopReady(client: Client, ctx: TenantContext) {
    await client.query(
      `INSERT INTO units (key, name) VALUES
        ('pcs', 'Piece'),
        ('kg', 'Kilogram'),
        ('g', 'Gram'),
        ('l', 'Litre'),
        ('ml', 'Millilitre'),
        ('box', 'Box'),
        ('pkt', 'Packet'),
        ('dz', 'Dozen')
       ON CONFLICT (key) DO NOTHING`,
    )

    await client.query(
      `INSERT INTO tax_rates (name, rate_bps, cess_bps, is_exempt) VALUES
        ('0%', 0, 0, false),
        ('5%', 500, 0, false),
        ('12%', 1200, 0, false),
        ('18%', 1800, 0, false),
        ('28%', 2800, 0, false),
        ('Exempt', 0, 0, true)
       ON CONFLICT (rate_bps, cess_bps, is_exempt) DO NOTHING`,
    )

    const profile = await client.query(`SELECT id FROM business_profile WHERE id = 1`)
    if ((profile.rowCount ?? 0) === 0) {
      await client.query(
        `INSERT INTO business_profile (id, legal_name, display_name, category_key, state_code, gst_registered)
         VALUES (1, $1, $2, $3, '27', false)`,
        [ctx.legalName, ctx.displayName, ctx.categoryKey],
      )
    }

    let branch = await client.query<{ id: string }>(
      `SELECT id FROM branches WHERE deleted_at IS NULL ORDER BY is_default DESC, created_at ASC LIMIT 1`,
    )
    if (!branch.rows[0]) {
      branch = await client.query<{ id: string }>(
        `INSERT INTO branches (name, code, state_code, is_default)
         VALUES ('Main', 'MAIN', '27', true)
         RETURNING id`,
      )
    }
    const branchId = branch.rows[0]!.id

    const location = await client.query<{ id: string }>(
      `SELECT id FROM stock_locations WHERE branch_id = $1 ORDER BY is_default DESC LIMIT 1`,
      [branchId],
    )
    if (!location.rows[0]) {
      await client.query(
        `INSERT INTO stock_locations (branch_id, name, is_default) VALUES ($1, 'Shop floor', true)`,
        [branchId],
      )
    }

    const counter = await client.query(
      `SELECT id FROM counters WHERE branch_id = $1 LIMIT 1`,
      [branchId],
    )
    if ((counter.rowCount ?? 0) === 0) {
      await client.query(
        `INSERT INTO counters (branch_id, name) VALUES ($1, 'Counter 1')`,
        [branchId],
      )
    }

    await client.query(
      `INSERT INTO staff (user_id, display_name)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO NOTHING`,
      [ctx.userId, ctx.displayName],
    )

    const fy = financialYearBounds(new Date())
    let fyRow = await client.query<{ id: string }>(
      `SELECT id FROM financial_years WHERE label = $1`,
      [fy.label],
    )
    if (!fyRow.rows[0]) {
      fyRow = await client.query<{ id: string }>(
        `INSERT INTO financial_years (label, starts_on, ends_on, status)
         VALUES ($1, $2, $3, 'open')
         RETURNING id`,
        [fy.label, fy.startsOn, fy.endsOn],
      )
    }
    const fyId = fyRow.rows[0]!.id

    for (const [docType, prefix] of [
      ['tax_invoice', 'INV'],
      ['bill_of_supply', 'BOS'],
    ] as const) {
      await client.query(
        `INSERT INTO invoice_series (fy_id, doc_type, prefix, next_number)
         SELECT $1, $2, $3, 1
         WHERE NOT EXISTS (
           SELECT 1 FROM invoice_series
           WHERE fy_id = $1 AND doc_type = $2 AND branch_id IS NULL AND gst_registration_id IS NULL
         )`,
        [fyId, docType, prefix],
      )
    }
  }
}

function financialYearBounds(now: Date) {
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1
  const startYear = month >= 4 ? year : year - 1
  const endYear = startYear + 1
  const yy = (n: number) => String(n).slice(-2)
  return {
    label: `${yy(startYear)}${yy(endYear)}`,
    startsOn: `${startYear}-04-01`,
    endsOn: `${endYear}-03-31`,
  }
}
