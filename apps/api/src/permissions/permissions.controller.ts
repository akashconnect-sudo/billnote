import { Body, Controller, Get, Inject, Put, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import {
  getHelp,
  permissionTypes,
  type PermissionState,
  type PermissionType,
} from '@billnote/shared'
import { z } from 'zod'
import { AuthGuard, type AuthedRequest } from '../auth/auth.guard.js'
import { fail, ok } from '../common/envelope.js'
import { RedisService } from '../redis/redis.service.js'

const updateSchema = z.object({
  type: z.enum(permissionTypes),
  state: z.enum([
    'not_determined',
    'granted',
    'denied',
    'blocked',
    'limited',
    'restricted',
    'skipped',
  ]),
})

@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/v1/settings/permissions-status')
export class PermissionsController {
  constructor(@Inject(RedisService) private readonly redis: RedisService) {}

  private key(userId: string) {
    return `perms:device:${userId}`
  }

  @Get()
  async list(@Req() req: AuthedRequest) {
    const stored =
      (await this.redis.getJson<Partial<Record<PermissionType, PermissionState>>>(
        this.key(req.auth!.sub),
      )) ?? {}

    const items = permissionTypes.map((type) => ({
      type,
      state: stored[type] ?? ('not_determined' as PermissionState),
      help: getHelp(`permission.${type}` as 'permission.camera'),
    }))

    return ok({ items })
  }

  @Put()
  async update(@Req() req: AuthedRequest, @Body() body: unknown) {
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return fail('VALIDATION', 'Pick a permission and a status.')
    }
    const key = this.key(req.auth!.sub)
    const stored =
      (await this.redis.getJson<Record<string, PermissionState>>(key)) ?? {}
    stored[parsed.data.type] = parsed.data.state
    await this.redis.setJson(key, stored, 60 * 60 * 24 * 365)
    return ok({ type: parsed.data.type, state: parsed.data.state })
  }
}
