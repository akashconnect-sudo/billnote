import { createHash, randomInt } from 'node:crypto'
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { users } from '@billnote/db'
import { fail, ok } from '../common/envelope.js'
import { MailService } from '../mail/mail.service.js'
import { RedisService } from '../redis/redis.service.js'
import { AuthService } from './auth.service.js'

export type OtpPurpose = 'login' | 'signup'

type StoredOtp = {
  hash: string
  attempts: number
  purpose: OtpPurpose
}

@Injectable()
export class OtpService {
  private readonly ttlSeconds = 60 * 10
  private readonly maxAttempts = 5

  constructor(
    @Inject(RedisService) private readonly redis: RedisService,
    @Inject(MailService) private readonly mail: MailService,
    @Inject(AuthService) private readonly auth: AuthService,
  ) {}

  async request(input: {
    email: string
    purpose: OtpPurpose
    ip?: string
  }) {
    const email = input.email.trim().toLowerCase()
    if (!email.includes('@')) {
      throw new BadRequestException(fail('VALIDATION', 'Enter a valid email address.'))
    }

    const rate = await this.redis.hitRateLimit(`rl:otp:${email}`, 5, 60 * 15)
    if (!rate.allowed) {
      throw new UnauthorizedException(
        fail('RATE_LIMITED', 'Too many OTP requests. Try again in a few minutes.'),
      )
    }

    const existing = await users.findUserByIdentifier(email)
    if (input.purpose === 'login' && (!existing || existing.status !== 'active' || existing.deletedAt)) {
      throw new UnauthorizedException(
        fail('UNAUTHENTICATED', 'No account found for that email.'),
      )
    }
    if (input.purpose === 'signup' && existing) {
      throw new BadRequestException(
        fail('CONFLICT', 'That email is already registered. Log in instead.'),
      )
    }

    const code = String(randomInt(100000, 999999))
    const payload: StoredOtp = {
      hash: this.hashCode(email, input.purpose, code),
      attempts: 0,
      purpose: input.purpose,
    }
    await this.redis.setJson(this.key(email, input.purpose), payload, this.ttlSeconds)

    const subject =
      input.purpose === 'signup'
        ? 'Your BILLNOTE signup code'
        : 'Your BILLNOTE login code'
    const text = `Your BILLNOTE verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`
    const html = `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#14241a">
        <p style="margin:0 0 12px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#1d4d32;font-weight:700">BILLNOTE</p>
        <h1 style="margin:0 0 8px;font-size:22px">Verification code</h1>
        <p style="margin:0 0 20px;color:#4b6354">Use this code to ${
          input.purpose === 'signup' ? 'create your account' : 'log in'
        }. It expires in 10 minutes.</p>
        <p style="margin:0 0 24px;font-size:32px;letter-spacing:0.35em;font-weight:700;color:#1d4d32">${code}</p>
        <p style="margin:0;font-size:13px;color:#6b7f73">If you did not request this, you can ignore this email.</p>
      </div>
    `

    const sent = await this.mail.send({ to: email, subject, text, html })
    const exposeCode =
      process.env.NODE_ENV !== 'production' || process.env.EMAIL_EXPOSE_OTP === 'true'

    return ok({
      sent: sent.delivered || sent.provider === 'console',
      delivered: sent.delivered,
      provider: sent.provider,
      expiresIn: this.ttlSeconds,
      ...(exposeCode ? { devCode: code } : {}),
    })
  }

  async verifyLogin(input: {
    email: string
    code: string
    platform?: string
    userAgent?: string
    ip?: string
  }) {
    const email = input.email.trim().toLowerCase()
    await this.assertValidCode(email, 'login', input.code)

    const user = await users.findUserByIdentifier(email)
    if (!user || user.status !== 'active' || user.deletedAt) {
      throw new UnauthorizedException(fail('UNAUTHENTICATED', 'No account found for that email.'))
    }

    await users.putLoginEvent({
      userId: user.id,
      identifier: email,
      success: true,
      reason: 'otp',
      ip: input.ip,
      userAgent: input.userAgent,
    })

    // reuse password login session creation via public login path after marking OTP ok
    return this.auth.completeOtpLogin({
      userId: user.id,
      platform: input.platform,
      userAgent: input.userAgent,
      ip: input.ip,
    })
  }

  async verifySignup(input: {
    fullName: string
    email: string
    password: string
    code: string
    platform?: string
    userAgent?: string
    ip?: string
  }) {
    const email = input.email.trim().toLowerCase()
    await this.assertValidCode(email, 'signup', input.code)
    return this.auth.signup({
      fullName: input.fullName,
      email,
      password: input.password,
      platform: input.platform,
      userAgent: input.userAgent,
      ip: input.ip,
    })
  }

  private async assertValidCode(email: string, purpose: OtpPurpose, code: string) {
    const key = this.key(email, purpose)
    const stored = await this.redis.getJson<StoredOtp>(key)
    if (!stored || stored.purpose !== purpose) {
      throw new UnauthorizedException(
        fail('UNAUTHENTICATED', 'OTP expired or not found. Request a new code.'),
      )
    }
    if (stored.attempts >= this.maxAttempts) {
      await this.redis.del(key)
      throw new UnauthorizedException(
        fail('RATE_LIMITED', 'Too many wrong codes. Request a new OTP.'),
      )
    }

    const expected = this.hashCode(email, purpose, code.trim())
    if (expected !== stored.hash) {
      stored.attempts += 1
      await this.redis.setJson(key, stored, this.ttlSeconds)
      throw new UnauthorizedException(fail('UNAUTHENTICATED', 'That OTP is incorrect.'))
    }

    await this.redis.del(key)
  }

  private key(email: string, purpose: OtpPurpose) {
    return `otp:${purpose}:${email}`
  }

  private hashCode(email: string, purpose: OtpPurpose, code: string) {
    return createHash('sha256')
      .update(`${purpose}:${email}:${code}:${process.env.JWT_ACCESS_SECRET ?? 'otp'}`)
      .digest('hex')
  }
}
