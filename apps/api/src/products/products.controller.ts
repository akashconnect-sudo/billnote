import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { fail } from '../common/envelope.js'
import { AuthGuard, type AuthedRequest } from '../auth/auth.guard.js'
import { ProductsService } from './products.service.js'

const createSchema = z.object({
  name: z.string().min(1).max(200),
  kind: z.enum(['product', 'service']).optional(),
  salePricePaise: z.number().int().nonnegative(),
  mrpPaise: z.number().int().nonnegative().nullable().optional(),
  purchasePricePaise: z.number().int().nonnegative().optional(),
  sku: z.string().max(64).nullable().optional(),
  hsnSac: z.string().max(16).nullable().optional(),
  barcode: z.string().max(64).nullable().optional(),
  unitKey: z.string().max(16).optional(),
  trackStock: z.boolean().optional(),
})

const updateSchema = createSchema.partial().extend({
  active: z.boolean().optional(),
})

const lookupSchema = z.object({
  barcode: z.string().min(1).max(64),
})

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/v1')
export class ProductsController {
  constructor(@Inject(ProductsService) private readonly products: ProductsService) {}

  @Get('products')
  list(@Req() req: AuthedRequest, @Query('q') q?: string) {
    return this.products.list(req.auth!.sub, req.auth!.bid, q)
  }

  @Post('products')
  create(@Req() req: AuthedRequest, @Body() body: unknown) {
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return fail(
        'VALIDATION',
        'Check the item details and try again.',
        parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      )
    }
    return this.products.create(req.auth!.sub, req.auth!.bid, parsed.data)
  }

  @Patch('products/:id')
  update(@Req() req: AuthedRequest, @Param('id') id: string, @Body() body: unknown) {
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return fail(
        'VALIDATION',
        'Check the item details and try again.',
        parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      )
    }
    return this.products.update(req.auth!.sub, req.auth!.bid, id, parsed.data)
  }

  @Delete('products/:id')
  remove(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.products.softDelete(req.auth!.sub, req.auth!.bid, id)
  }

  @Post('barcodes/lookup')
  lookup(@Req() req: AuthedRequest, @Body() body: unknown) {
    const parsed = lookupSchema.safeParse(body)
    if (!parsed.success) {
      return fail('VALIDATION', 'Barcode is required.')
    }
    return this.products.lookupBarcode(req.auth!.sub, req.auth!.bid, parsed.data.barcode)
  }
}
