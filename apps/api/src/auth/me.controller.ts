import { Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { getControlDb } from '@billnote/db'
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
  async businesses(@Req() req: AuthedRequest) {
    const rows = await getControlDb().membership.findMany({
      where: { userId: req.auth!.sub, status: 'active' },
      include: { business: true },
      orderBy: { createdAt: 'asc' },
    })
    return ok(
      rows.map((m: (typeof rows)[number]) => ({
        membershipId: m.id,
        businessId: m.businessId,
        roleKey: m.roleKey,
        isDefault: m.isDefault,
        status: m.business.status,
        displayName: m.business.displayName,
        categoryKey: m.business.categoryKey,
      })),
    )
  }

  @Post('businesses/:id/switch')
  async switchBusiness(@Req() req: AuthedRequest, @Param('id') businessId: string) {
    const membership = await getControlDb().membership.findFirst({
      where: {
        userId: req.auth!.sub,
        businessId,
        status: 'active',
      },
      include: { business: true },
    })
    if (!membership) {
      return fail('FORBIDDEN', 'You do not belong to that business.')
    }
    if (membership.business.status !== 'ready') {
      return fail(
        'TENANT_NOT_READY',
        'This shop is still being set up. Please wait a moment.',
      )
    }

    await getControlDb().membership.updateMany({
      where: { userId: req.auth!.sub },
      data: { isDefault: false },
    })
    await getControlDb().membership.update({
      where: { id: membership.id },
      data: { isDefault: true },
    })

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
        displayName: membership.business.displayName,
        categoryKey: membership.business.categoryKey,
        status: membership.business.status,
      },
      roleKey: membership.roleKey,
    })
  }
}
