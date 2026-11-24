import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import { fail } from '../common/envelope.js'
import { AuthService } from './auth.service.js'
import { TokenService, type AccessClaims } from './token.service.js'

export type AuthedRequest = Request & {
  auth?: AccessClaims
  permissions?: string[]
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(TokenService) private readonly tokens: TokenService,
    @Inject(AuthService) private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>()
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        fail('UNAUTHENTICATED', 'Please log in to continue.'),
      )
    }
    try {
      const claims = await this.tokens.verifyAccess(header.slice(7))
      req.auth = claims
      if (claims.mid && typeof claims.pv === 'number' && claims.role) {
        req.permissions = await this.auth.getPermissions(claims.mid, claims.pv, claims.role)
      }
      return true
    } catch {
      throw new UnauthorizedException(
        fail('UNAUTHENTICATED', 'Your session expired. Please log in again.'),
      )
    }
  }
}
