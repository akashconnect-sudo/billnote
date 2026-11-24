import { Inject, Injectable } from '@nestjs/common'
import { createTenantDatabaseName, getControlDb } from '@billnote/db'
import { AuthService } from '../auth/auth.service.js'
import { TokenService } from '../auth/token.service.js'
import { ok } from '../common/envelope.js'
import { ProvisionQueue } from '../queue/provision.queue.js'

@Injectable()
export class BusinessesService {
  constructor(
    @Inject(ProvisionQueue) private readonly provisionQueue: ProvisionQueue,
    @Inject(TokenService) private readonly tokens: TokenService,
    @Inject(AuthService) private readonly auth: AuthService,
  ) {}

  async create(input: {
    userId: string
    sessionId: string
    legalName: string
    displayName: string
    categoryKey: string
    idempotencyKey?: string
  }) {
    const db = getControlDb()

    if (input.idempotencyKey) {
      const existing = await db.idempotencyKey.findUnique({
        where: { key: input.idempotencyKey },
      })
      if (existing) {
        return existing.response
      }
    }

    const business = await db.business.create({
      data: {
        ownerUserId: input.userId,
        legalName: input.legalName.trim(),
        displayName: input.displayName.trim(),
        categoryKey: input.categoryKey,
        status: 'provisioning',
        databaseName: 'pending',
      },
    })

    const databaseName = createTenantDatabaseName(business.id)
    const updated = await db.business.update({
      where: { id: business.id },
      data: { databaseName },
    })

    await db.membership.create({
      data: {
        userId: input.userId,
        businessId: business.id,
        roleKey: 'owner',
        isDefault: true,
        status: 'active',
      },
    })

    await db.tenantMigrationState.create({
      data: {
        businessId: business.id,
        currentVersion: 0,
        targetVersion: 1,
        status: 'running',
      },
    })

    await db.plan.upsert({
      where: { id: 'free' },
      create: {
        id: 'free',
        name: 'Free',
        priceMonthlyPaise: 0n,
        priceYearlyPaise: 0n,
        limits: { users: 1, billsPerMonth: 30, branches: 1 },
        features: { watermark: true },
      },
      update: {},
    })

    const now = new Date()
    const trialEnd = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14)
    await db.subscription.create({
      data: {
        businessId: business.id,
        planId: 'free',
        status: 'trialing',
        trialEndsAt: trialEnd,
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
      },
    })

    await this.provisionQueue.enqueue(business.id)

    const membership = await db.membership.findFirstOrThrow({
      where: { userId: input.userId, businessId: business.id },
    })
    await this.auth.cachePermissions(membership.id, membership.permVersion, membership.roleKey)
    const accessToken = await this.tokens.signAccess({
      sub: input.userId,
      sid: input.sessionId,
      bid: membership.businessId,
      mid: membership.id,
      role: membership.roleKey,
      pv: membership.permVersion,
    })

    const response = ok({
      id: updated.id,
      displayName: updated.displayName,
      categoryKey: updated.categoryKey,
      status: updated.status,
      databaseName: updated.databaseName,
      accessToken,
    })

    if (input.idempotencyKey) {
      await db.idempotencyKey.create({
        data: {
          key: input.idempotencyKey,
          userId: input.userId,
          method: 'POST',
          path: '/api/v1/businesses',
          requestHash: input.idempotencyKey,
          statusCode: 202,
          response,
        },
      })
    }

    return response
  }

  async provisioningStatus(userId: string, businessId: string) {
    const membership = await getControlDb().membership.findFirst({
      where: { userId, businessId },
      include: { business: true },
    })
    if (!membership) {
      return {
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Business not found.',
          details: [],
          requestId: null,
        },
      }
    }

    const state = await getControlDb().tenantMigrationState.findUnique({
      where: { businessId },
    })

    return ok({
      businessId,
      status: membership.business.status,
      schemaVersion: membership.business.schemaVersion,
      migration: state
        ? {
            currentVersion: state.currentVersion,
            targetVersion: state.targetVersion,
            status: state.status,
            lastError: state.lastError,
          }
        : null,
    })
  }

  async retry(userId: string, businessId: string) {
    const membership = await getControlDb().membership.findFirst({
      where: { userId, businessId, roleKey: 'owner' },
    })
    if (!membership) {
      return {
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Only the owner can retry setup.',
          details: [],
          requestId: null,
        },
      }
    }

    await getControlDb().business.update({
      where: { id: businessId },
      data: { status: 'provisioning' },
    })

    await this.provisionQueue.enqueue(businessId)
    return ok({ queued: true })
  }
}
