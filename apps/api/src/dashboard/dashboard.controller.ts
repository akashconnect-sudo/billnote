import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard, type AuthedRequest } from '../auth/auth.guard.js'
import { DashboardService } from './dashboard.service.js'

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboard: DashboardService) {}

  @Get('today')
  today(@Req() req: AuthedRequest) {
    return this.dashboard.today(req.auth!.sub, req.auth!.bid)
  }
}
