import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service.js'

export const REDIS_SERVICE = RedisService

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
