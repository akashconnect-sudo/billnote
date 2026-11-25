import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { pingDynamo } from '@billnote/db'
import { fail, ok } from '../common/envelope.js'
import { RedisService } from '../redis/redis.service.js'

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(@Inject(RedisService) private readonly redis: RedisService) {}

  @Get('health/live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiOkResponse({ description: 'Process is up' })
  live() {
    return ok({ status: 'ok' })
  }

  @Get('health/ready')
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiOkResponse({ description: 'DynamoDB and Redis reachable' })
  async ready() {
    const checks: Record<string, string> = {}

    try {
      checks.dynamodb = (await pingDynamo()) ? 'ok' : 'down'
    } catch {
      checks.dynamodb = 'down'
    }

    try {
      checks.redis = (await this.redis.ping()) ? 'ok' : 'down'
    } catch {
      checks.redis = 'down'
    }

    if (checks.dynamodb !== 'ok' || checks.redis !== 'ok') {
      throw new ServiceUnavailableException(
        fail('NOT_READY', 'DynamoDB or Redis is not reachable.', [
          { path: 'dynamodb', message: checks.dynamodb ?? 'unknown' },
          { path: 'redis', message: checks.redis ?? 'unknown' },
        ]),
      )
    }

    return ok({ status: 'ready', checks })
  }
}
