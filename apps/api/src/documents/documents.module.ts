import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module.js'
import { TenantService } from '../tenant/tenant.service.js'
import { DocumentsController } from './documents.controller.js'
import { DocumentsService } from './documents.service.js'

@Module({
  imports: [AuthModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, TenantService],
})
export class DocumentsModule {}
