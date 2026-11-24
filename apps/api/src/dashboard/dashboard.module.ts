import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module.js'
import { TenantService } from '../tenant/tenant.service.js'
import { DashboardController } from './dashboard.controller.js'
import { DashboardService } from './dashboard.service.js'

@Module({
  imports: [AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService, TenantService],
})
export class DashboardModule {}
