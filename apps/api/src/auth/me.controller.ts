import { Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { businesses } from '@billnote/db'
import { fail, ok } from '../common/envelope.js'
import { RedisService } from '../redis/redis.service.js'
import { AuthGuard, type AuthedRequest } from './auth.guard.js'
import { AuthService } from './auth.service.js'
import { TokenService } from './token.service.js'

@ApiTags('me')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/v1/me')
export class MeController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(TokenService) private readonly tokens: TokenService,
    @Inject(RedisService) private readonly redis: RedisService,
  ) {}

  @Get()
  me(@Req() req: AuthedRequest) {
    return this.auth.me(req.auth!.sub)
  }

  @Get('businesses')
  async listBusinesses(@Req() req: AuthedRequest) {
    const rows = await businesses.listMembershipsForUser(req.auth!.sub)
    const mapped = await Promise.all(
      rows.map(async (m) => {
        const business = await businesses.getBusiness(m.businessId)
        if (!business) return null
        return {
          membershipId: m.id,
          businessId: m.businessId,
          roleKey: m.roleKey,
          isDefault: m.isDefault,
          status: business.status,
          displayName: business.displayName,
          categoryKey: business.categoryKey,
        }
      }),
    )
    return ok(mapped.filter(Boolean))
  }

  @Post('businesses/:id/switch')
  async switchBusiness(@Req() req: AuthedRequest, @Param('id') businessId: string) {
    const membership = await businesses.getMembership(businessId, req.auth!.sub)
    const business = membership ? await businesses.getBusiness(businessId) : null
    if (!membership || membership.status !== 'active' || !business) {
      return fail('FORBIDDEN', 'You do not belong to that business.')
    }
    if (business.status !== 'ready') {
      return fail(
        'TENANT_NOT_READY',
        'This shop is still being set up. Please wait a moment.',
      )
    }

    await businesses.setDefaultMembership(req.auth!.sub, businessId)
    await this.auth.cachePermissions(
      membership.id,
      membership.permVersion,
      membership.roleKey,
    )

    const accessToken = await this.tokens.signAccess({
      sub: req.auth!.sub,
      sid: req.auth!.sid,
      bid: membership.businessId,
      mid: membership.id,
      role: membership.roleKey,
      pv: membership.permVersion,
    })

    await this.redis.setJson(
      `switch:${req.auth!.sub}`,
      { businessId, at: new Date().toISOString() },
      60 * 60,
    )

    return ok({
      accessToken,
      business: {
        id: membership.businessId,
        displayName: business.displayName,
        categoryKey: business.categoryKey,
        status: business.status,
      },
      roleKey: membership.roleKey,
    })
  }
}
