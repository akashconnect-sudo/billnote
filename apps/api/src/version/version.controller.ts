import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ok } from '../common/envelope.js'

@ApiTags('app')
@Controller()
export class VersionController {
  @Get('app/version')
  @ApiOperation({ summary: 'Client update check' })
  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({ name: 'version', required: false })
  @ApiOkResponse({ description: 'Minimum and latest versions' })
  version(
    @Query('platform') platform = 'web',
    @Query('version') installed = '0.2.0',
  ) {
    return ok({
      platform,
      installed,
      minSupported: '0.1.0',
      latest: '0.2.0',
      forceUpdate: false,
      notes: 'Phase 2: auth, Redis, tenant provisioning.',
    })
  }
}
