import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module.js'
import { BusinessesModule } from './businesses/businesses.module.js'
import { DashboardModule } from './dashboard/dashboard.module.js'
import { DocumentsModule } from './documents/documents.module.js'
import { HealthController } from './health/health.controller.js'
import { PermissionsController } from './permissions/permissions.controller.js'
import { ProductsModule } from './products/products.module.js'
import { RedisModule } from './redis/redis.module.js'
import { VersionController } from './version/version.controller.js'

@Module({
  imports: [
    RedisModule,
    AuthModule,
    BusinessesModule,
    ProductsModule,
    DocumentsModule,
    DashboardModule,
  ],
  controllers: [HealthController, VersionController, PermissionsController],
})
export class AppModule {}
