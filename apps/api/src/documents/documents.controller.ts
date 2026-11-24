import { Body, Controller, Get, Headers, Inject, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { AuthGuard, type AuthedRequest } from '../auth/auth.guard.js'
import { fail } from '../common/envelope.js'
import { DocumentsService } from './documents.service.js'

const chargeSchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string().uuid(),
        qtyMilli: z.number().int().positive(),
        unitPricePaise: z.number().int().nonnegative().optional(),
        discountPaise: z.number().int().nonnegative().optional(),
      }),
    )
    .min(1)
    .max(200),
  paymentMode: z.enum(['cash', 'upi', 'card', 'credit']),
  hold: z.boolean().optional(),
  notes: z.string().max(500).optional(),
})

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/v1')
export class DocumentsController {
  constructor(@Inject(DocumentsService) private readonly documents: DocumentsService) {}

  @Post('pos/charge')
  charge(
    @Req() req: AuthedRequest,
    @Body() body: unknown,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    const parsed = chargeSchema.safeParse(body)
    if (!parsed.success) {
      return fail(
        'VALIDATION',
        'Check the bill items and payment mode.',
        parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      )
    }
    return this.documents.charge(req.auth!.sub, req.auth!.bid, {
      ...parsed.data,
      idempotencyKey,
    })
  }

  @Get('documents/:id')
  get(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.documents.get(req.auth!.sub, req.auth!.bid, id)
  }

  @Get('documents/:id/receipt')
  receipt(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.documents.receiptHtml(req.auth!.sub, req.auth!.bid, id)
  }
}
