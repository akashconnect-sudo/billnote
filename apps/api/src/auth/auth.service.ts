import { randomUUID } from 'node:crypto'
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { businesses, sessions, users } from '@billnote/db'
import { permissionsForRole } from '../common/permissions-catalog.js'
import { fail, ok } from '../common/envelope.js'
import { RedisService } from '../redis/redis.service.js'
import { PasswordService } from './password.service.js'
import { TokenService } from './token.service.js'

type SignupInput = {
  fullName: string
  email?: string
  phoneE164?: string
  password: string
  platform?: string
  userAgent?: string
  ip?: string
}

type LoginInput = {
  identifier: string
  password: string
  platform?: string
  userAgent?: string
  ip?: string
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PasswordService) private readonly passwords: PasswordService,
    @Inject(TokenService) private readonly tokens: TokenService,
    @Inject(RedisService) private readonly redis: RedisService,
  ) {}

  async signup(input: SignupInput) {
    if (!input.email && !input.phoneE164) {
      throw new ConflictException(
        fail('VALIDATION', 'Enter an email or an Indian mobile number.'),
      )
    }

    const rate = await this.redis.hitRateLimit(
      `rl:signup:${input.ip ?? 'unknown'}`,
      10,
      60 * 15,
    )
    if (!rate.allowed) {
      throw new UnauthorizedException(
        fail('RATE_LIMITED', 'Too many signups from this network. Try again later.'),
      )
    }

    const passwordHash = await this.passwords.hash(input.password)
    try {
      const user = await users.createUser({
        fullName: input.fullName.trim(),
        email: input.email?.toLowerCase(),
        phoneE164: input.phoneE164,
        passwordHash,
      })
      const session = await this.createSession(user.id, input)
      return ok({
        user: this.publicUser(user),
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresIn: 900,
      })
    } catch {
      throw new ConflictException(
        fail('CONFLICT', 'That email or phone is already registered.'),
      )
    }
  }

  async login(input: LoginInput) {
    const rate = await this.redis.hitRateLimit(
      `rl:login:${input.identifier.toLowerCase()}`,
      5,
      60 * 15,
    )
    if (!rate.allowed) {
      throw new UnauthorizedException(
        fail('RATE_LIMITED', 'Too many login attempts. Try again in a few minutes.'),
      )
    }

    const identifier = input.identifier.trim()
    const user = await users.findUserByIdentifier(identifier)

    const invalid = async (reason: string) => {
      await users.putLoginEvent({
        userId: user?.id,
        identifier,
        success: false,
        reason,
        ip: input.ip,
        userAgent: input.userAgent,
      })
      throw new UnauthorizedException(
        fail('UNAUTHENTICATED', 'Email/phone or password is wrong.'),
      )
    }

    if (!user?.passwordHash || user.status !== 'active' || user.deletedAt) {
      await invalid('not_found_or_disabled')
    }

    const matches = await this.passwords.verify(user!.passwordHash!, input.password)
    if (!matches) {
      await invalid('bad_password')
    }

    await users.putLoginEvent({
      userId: user!.id,
      identifier,
      success: true,
      ip: input.ip,
      userAgent: input.userAgent,
    })

    const session = await this.createSession(user!.id, input)
    return ok({
      user: this.publicUser(user!),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresIn: 900,
    })
  }

  async refresh(refreshToken: string, meta: { userAgent?: string; ip?: string }) {
    const hash = this.tokens.verifyRefreshShape(refreshToken)
    const existing = await sessions.findSessionByRefreshHash(hash)
    if (!existing || existing.revokedAt || new Date(existing.expiresAt) < new Date()) {
      throw new UnauthorizedException(fail('UNAUTHENTICATED', 'Please log in again.'))
    }

    if (existing.replacedBySessionId) {
      await sessions.revokeFamily(existing.userId, existing.familyId, 'refresh_reuse')
      throw new UnauthorizedException(fail('UNAUTHENTICATED', 'Please log in again.'))
    }

    const next = this.tokens.createRefreshToken()
    const created = await sessions.createSession({
      userId: existing.userId,
      refreshTokenHash: next.hash,
      familyId: existing.familyId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      userAgent: meta.userAgent,
      ip: meta.ip,
      platform: existing.platform ?? undefined,
    })

    await sessions.revokeSession(existing, 'rotated', created.id)

    const membership = await businesses.getDefaultMembership(existing.userId)
    const accessToken = await this.tokens.signAccess({
      sub: existing.userId,
      sid: created.id,
      bid: membership?.businessId,
      mid: membership?.id,
      role: membership?.roleKey,
      pv: membership?.permVersion,
    })

    if (membership) {
      await this.cachePermissions(membership.id, membership.permVersion, membership.roleKey)
    }

    return ok({
      accessToken,
      refreshToken: next.token,
      expiresIn: 900,
    })
  }

  async completeOtpLogin(input: {
    userId: string
    platform?: string
    userAgent?: string
    ip?: string
  }) {
    const user = await users.getUserById(input.userId)
    if (!user || user.status !== 'active' || user.deletedAt) {
      throw new UnauthorizedException(fail('UNAUTHENTICATED', 'Please log in again.'))
    }
    const session = await this.createSession(user.id, input)
    return ok({
      user: this.publicUser(user),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresIn: 900,
    })
  }

  async logout(sessionId: string, userId?: string) {
    if (userId) {
      await sessions.revokeSessionById(userId, sessionId, 'logout')
    }
    return ok({ loggedOut: true })
  }

  async me(userId: string) {
    const user = await users.getUserById(userId)
    if (!user) throw new UnauthorizedException(fail('UNAUTHENTICATED', 'Please log in again.'))
    const memberships = await businesses.listMembershipsForUser(userId)
    const withBiz = await Promise.all(
      memberships.map(async (m) => {
        const business = await businesses.getBusiness(m.businessId)
        return { m, business }
      }),
    )
    return ok({
      user: this.publicUser(user),
      businesses: withBiz
        .filter((row) => row.business)
        .map(({ m, business }) => ({
          membershipId: m.id,
          businessId: m.businessId,
          roleKey: m.roleKey,
          isDefault: m.isDefault,
          status: business!.status,
          displayName: business!.displayName,
          categoryKey: business!.categoryKey,
        })),
    })
  }

  async cachePermissions(membershipId: string, permVersion: number, roleKey: string) {
    const perms = permissionsForRole(roleKey)
    await this.redis.setJson(`perm:${membershipId}:${permVersion}`, perms, 60 * 30)
    return perms
  }

  async getPermissions(membershipId: string, permVersion: number, roleKey: string) {
    const key = `perm:${membershipId}:${permVersion}`
    const cached = await this.redis.getJson<string[]>(key)
    if (cached) return cached
    return this.cachePermissions(membershipId, permVersion, roleKey)
  }

  private async createSession(
    userId: string,
    meta: { platform?: string; userAgent?: string; ip?: string },
  ) {
    const refresh = this.tokens.createRefreshToken()
    const session = await sessions.createSession({
      id: randomUUID(),
      userId,
      refreshTokenHash: refresh.hash,
      familyId: refresh.familyId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      userAgent: meta.userAgent,
      ip: meta.ip,
      platform: meta.platform,
    })

    const membership = await businesses.getDefaultMembership(userId)
    const accessToken = await this.tokens.signAccess({
      sub: userId,
      sid: session.id,
      bid: membership?.businessId,
      mid: membership?.id,
      role: membership?.roleKey,
      pv: membership?.permVersion,
    })

    if (membership) {
      await this.cachePermissions(membership.id, membership.permVersion, membership.roleKey)
    }

    return { accessToken, refreshToken: refresh.token, sessionId: session.id }
  }

  private publicUser(user: {
    id: string
    fullName: string
    email: string | null
    phoneE164: string | null
    locale: string
  }) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneE164: user.phoneE164,
      locale: user.locale,
    }
  }
}
