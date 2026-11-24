import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller.js'
import { AuthGuard } from './auth.guard.js'
import { AuthService } from './auth.service.js'
import { MeController } from './me.controller.js'
import { PasswordService } from './password.service.js'
import { TokenService } from './token.service.js'

@Module({
  controllers: [AuthController, MeController],
  providers: [AuthService, PasswordService, TokenService, AuthGuard],
  exports: [AuthService, TokenService, AuthGuard, PasswordService],
})
export class AuthModule {}
