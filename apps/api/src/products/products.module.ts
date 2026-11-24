import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module.js'
import { TenantService } from '../tenant/tenant.service.js'
import { ProductsController } from './products.controller.js'
import { ProductsService } from './products.service.js'

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, TenantService],
})
export class ProductsModule {}
