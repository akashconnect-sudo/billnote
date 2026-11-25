import { Inject, Injectable } from '@nestjs/common'
import { businesses } from '@billnote/db'
import { AuthService } from '../auth/auth.service.js'
import { TokenService } from '../auth/token.service.js'
import { ok } from '../common/envelope.js'

@Injectable()
export class BusinessesService {
  constructor(
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
    if (input.idempotencyKey) {
      const existing = await businesses.getIdempotency(input.userId, input.idempotencyKey)
      if (existing) return existing
    }

    const { business, membership } = await businesses.createBusinessWithOwner({
      userId: input.userId,
      legalName: input.legalName.trim(),
      displayName: input.displayName.trim(),
      categoryKey: input.categoryKey,
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
      id: business.id,
      displayName: business.displayName,
      categoryKey: business.categoryKey,
      status: business.status,
      databaseName: business.databaseName,
      accessToken,
    })

    if (input.idempotencyKey) {
      await businesses.putIdempotency({
        key: input.idempotencyKey,
        userId: input.userId,
        response,
      })
    }

    return response
  }

  async provisioningStatus(userId: string, businessId: string) {
    const membership = await businesses.getMembership(businessId, userId)
    const business = membership ? await businesses.getBusiness(businessId) : null
    if (!membership || !business) {
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

    return ok({
      businessId,
      status: business.status,
      schemaVersion: business.schemaVersion,
      migration: {
        currentVersion: business.schemaVersion,
        targetVersion: business.schemaVersion,
        status: 'idle',
        lastError: null,
      },
    })
  }

  async retry(userId: string, businessId: string) {
    const membership = await businesses.getMembership(businessId, userId)
    if (!membership || membership.roleKey !== 'owner') {
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

    await businesses.updateBusinessStatus(businessId, 'ready')
    return ok({ queued: true })
  }
}
