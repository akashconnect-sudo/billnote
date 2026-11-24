import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { z } from 'zod'
import { fail } from '../common/envelope.js'
import { AuthGuard, type AuthedRequest } from './auth.guard.js'
import { AuthService } from './auth.service.js'

const signupSchema = z
  .object({
    fullName: z.string().min(2).max(120),
    email: z.string().email().optional(),
    phoneE164: z
      .string()
      .regex(/^\+91[6-9]\d{9}$/, 'Use an Indian mobile like +919876543210')
      .optional(),
    password: z.string().min(8).max(128),
    platform: z.enum(['web', 'android', 'ios', 'windows', 'macos', 'linux']).optional(),
  })
  .refine((value) => Boolean(value.email || value.phoneE164), {
    message: 'Enter an email or phone number',
  })

const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
  platform: z.enum(['web', 'android', 'ios', 'windows', 'macos', 'linux']).optional(),
})

const refreshSchema = z.object({
  refreshToken: z.string().min(20).optional(),
})

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: unknown,
    @Req() req: AuthedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      return fail('VALIDATION', 'Check the form and try again.', [
        { path: parsed.error.issues[0]?.path.join('.') ?? 'body', message: parsed.error.issues[0]?.message ?? 'Invalid' },
      ])
    }
    const result = await this.auth.signup({
      ...parsed.data,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    })
    this.setRefreshCookie(res, result.data.refreshToken)
    return result
  }

  @Post('login')
  async login(
    @Body() body: unknown,
    @Req() req: AuthedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return fail('VALIDATION', 'Enter your email/phone and password.')
    }
    const result = await this.auth.login({
      ...parsed.data,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    })
    this.setRefreshCookie(res, result.data.refreshToken)
    return result
  }

  @Post('refresh')
  async refresh(
    @Body() body: unknown,
    @Req() req: AuthedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const parsed = refreshSchema.safeParse(body ?? {})
    const cookieToken =
      (req.cookies?.['__Host-bn_refresh'] as string | undefined) ??
      (req.cookies?.bn_refresh as string | undefined)
    const refreshToken = parsed.success
      ? parsed.data.refreshToken ?? cookieToken
      : cookieToken
    if (!refreshToken) {
      return fail('UNAUTHENTICATED', 'Please log in again.')
    }
    const result = await this.auth.refresh(refreshToken, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    })
    this.setRefreshCookie(res, result.data.refreshToken)
    return result
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async logout(@Req() req: AuthedRequest, @Res({ passthrough: true }) res: Response) {
    if (req.auth?.sid) {
      await this.auth.logout(req.auth.sid)
    }
    res.clearCookie('__Host-bn_refresh', { path: '/api/v1/auth' })
    return { data: { loggedOut: true }, meta: { requestId: null }, error: null }
  }

  private setRefreshCookie(res: Response, token: string) {
    const secure = process.env.NODE_ENV === 'production'
    res.cookie(secure ? '__Host-bn_refresh' : 'bn_refresh', token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    })
  }
}
