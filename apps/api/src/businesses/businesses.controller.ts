import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { AuthGuard, type AuthedRequest } from '../auth/auth.guard.js'
import { fail } from '../common/envelope.js'
import { BusinessesService } from './businesses.service.js'

const createSchema = z.object({
  legalName: z.string().min(2).max(160),
  displayName: z.string().min(2).max(160),
  categoryKey: z.string().min(2).max(64),
})

@ApiTags('businesses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/v1/businesses')
export class BusinessesController {
  constructor(@Inject(BusinessesService) private readonly businesses: BusinessesService) {}

  @Post()
  create(
    @Req() req: AuthedRequest,
    @Body() body: unknown,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return fail('VALIDATION', 'Enter the shop name and business type.')
    }
    return this.businesses.create({
      userId: req.auth!.sub,
      sessionId: req.auth!.sid,
      ...parsed.data,
      idempotencyKey,
    })
  }

  @Get(':id/provisioning')
  provisioning(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.businesses.provisioningStatus(req.auth!.sub, id)
  }

  @Post(':id/provisioning/retry')
  retry(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.businesses.retry(req.auth!.sub, id)
  }
}
