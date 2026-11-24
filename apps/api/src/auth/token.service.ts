import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { SignJWT, jwtVerify } from 'jose'
import { getEnv } from '../env.js'

export type AccessClaims = {
  sub: string
  sid: string
  bid?: string
  mid?: string
  role?: string
  pv?: number
}

@Injectable()
export class TokenService {
  private accessSecret() {
    return new TextEncoder().encode(getEnv().JWT_ACCESS_SECRET)
  }

  private refreshSecret() {
    return new TextEncoder().encode(getEnv().JWT_REFRESH_SECRET)
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  createRefreshToken(): { token: string; hash: string; familyId: string } {
    const token = randomBytes(48).toString('base64url')
    return {
      token,
      hash: this.hashToken(token),
      familyId: randomUUID(),
    }
  }

  async signAccess(claims: AccessClaims, expiresIn = '15m'): Promise<string> {
    return new SignJWT({
      bid: claims.bid,
      mid: claims.mid,
      role: claims.role,
      pv: claims.pv,
      sid: claims.sid,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(claims.sub)
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(this.accessSecret())
  }

  async verifyAccess(token: string): Promise<AccessClaims> {
    const { payload } = await jwtVerify(token, this.accessSecret())
    if (!payload.sub || typeof payload.sid !== 'string') {
      throw new Error('Invalid access token')
    }
    return {
      sub: payload.sub,
      sid: payload.sid,
      bid: typeof payload.bid === 'string' ? payload.bid : undefined,
      mid: typeof payload.mid === 'string' ? payload.mid : undefined,
      role: typeof payload.role === 'string' ? payload.role : undefined,
      pv: typeof payload.pv === 'number' ? payload.pv : undefined,
    }
  }

  verifyRefreshShape(token: string): string {
    if (!token || token.length < 20) {
      throw new Error('Invalid refresh token')
    }
    return this.hashToken(token)
  }

  async signRefreshCookieValue(raw: string): Promise<string> {
    // Cookie stores the opaque refresh token; signing is optional integrity.
    return new SignJWT({ t: raw })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(this.refreshSecret())
  }
}
