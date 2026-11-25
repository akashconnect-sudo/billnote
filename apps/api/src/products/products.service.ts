import { Inject, Injectable } from '@nestjs/common'
import { products } from '@billnote/db'
import { fail, ok } from '../common/envelope.js'
import { TenantService } from '../tenant/tenant.service.js'

@Injectable()
export class ProductsService {
  constructor(@Inject(TenantService) private readonly tenants: TenantService) {}

  async list(userId: string, businessId: string | undefined, q?: string) {
    return this.tenants.withTenant(userId, businessId, async (ctx) => {
      const rows = await products.listProducts(ctx.businessId, q)
      return ok(rows.map(mapProduct))
    })
  }

  async create(
    userId: string,
    businessId: string | undefined,
    input: {
      name: string
      kind?: 'product' | 'service'
      salePricePaise: number
      mrpPaise?: number | null
      purchasePricePaise?: number
      sku?: string | null
      hsnSac?: string | null
      barcode?: string | null
      unitKey?: string
      trackStock?: boolean
    },
  ) {
    return this.tenants.withTenant(userId, businessId, async (ctx) => {
      const name = input.name.trim()
      if (!name) return fail('VALIDATION', 'Item name is required.')
      if (!Number.isInteger(input.salePricePaise) || input.salePricePaise < 0) {
        return fail('VALIDATION', 'Sale price must be a whole number of paise.')
      }
      if (!products.unitExists(input.unitKey ?? 'pcs')) {
        return fail('VALIDATION', 'Unknown unit.')
      }
      try {
        const created = await products.createProduct(ctx.businessId, input)
        return ok(mapProduct(created))
      } catch (error) {
        if (error instanceof Error && error.message === 'BARCODE_CONFLICT') {
          return fail('CONFLICT', 'That barcode is already on another item.')
        }
        throw error
      }
    })
  }

  async update(
    userId: string,
    businessId: string | undefined,
    productId: string,
    input: {
      name?: string
      salePricePaise?: number
      mrpPaise?: number | null
      purchasePricePaise?: number
      sku?: string | null
      hsnSac?: string | null
      barcode?: string | null
      active?: boolean
      trackStock?: boolean
    },
  ) {
    return this.tenants.withTenant(userId, businessId, async (ctx) => {
      try {
        const updated = await products.updateProduct(ctx.businessId, productId, input)
        if (!updated) return fail('NOT_FOUND', 'Item not found.')
        return ok(mapProduct(updated))
      } catch (error) {
        if (error instanceof Error && error.message === 'BARCODE_CONFLICT') {
          return fail('CONFLICT', 'That barcode is already on another item.')
        }
        throw error
      }
    })
  }

  async softDelete(userId: string, businessId: string | undefined, productId: string) {
    return this.tenants.withTenant(userId, businessId, async (ctx) => {
      const okDelete = await products.softDeleteProduct(ctx.businessId, productId)
      if (!okDelete) return fail('NOT_FOUND', 'Item not found.')
      return ok({ id: productId, deleted: true })
    })
  }

  async lookupBarcode(userId: string, businessId: string | undefined, barcodeRaw: string) {
    const barcode = barcodeRaw.trim()
    if (!barcode) return fail('VALIDATION', 'Barcode is required.')

    return this.tenants.withTenant(userId, businessId, async (ctx) => {
      const local = await products.findByBarcode(ctx.businessId, barcode)
      if (local) {
        return ok({ source: 'tenant' as const, product: mapProduct(local), suggestion: null })
      }
      const suggestion = await this.lookupExternal(barcode)
      return ok({
        source: suggestion ? suggestion.source : ('none' as const),
        product: null,
        suggestion,
      })
    })
  }

  private async lookupExternal(barcode: string) {
    const cached = await products.getBarcodeCache(barcode)
    if (cached && new Date(cached.expiresAt) > new Date()) {
      return {
        source: 'open_food_facts' as const,
        barcode,
        name: (cached.payload as { name?: string }).name ?? null,
        brand: (cached.payload as { brand?: string }).brand ?? null,
        imageUrl: (cached.payload as { imageUrl?: string }).imageUrl ?? null,
      }
    }

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
        { headers: { 'User-Agent': 'BILLNOTE/0.2 (billing software; local-dev)' } },
      )
      if (!response.ok) return null
      const json = (await response.json()) as {
        status?: number
        product?: {
          product_name?: string
          brands?: string
          image_front_small_url?: string
        }
      }
      if (json.status !== 1 || !json.product) return null
      const suggestion = {
        source: 'open_food_facts' as const,
        barcode,
        name: json.product.product_name ?? null,
        brand: json.product.brands ?? null,
        imageUrl: json.product.image_front_small_url ?? null,
      }
      await products.putBarcodeCache(
        barcode,
        suggestion,
        'open_food_facts',
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      )
      return suggestion
    } catch {
      return null
    }
  }
}

function mapProduct(row: {
  id: string
  kind: string
  name: string
  sku: string | null
  hsnSac: string | null
  salePricePaise: number
  mrpPaise: number | null
  purchasePricePaise: number
  trackStock: boolean
  active: boolean
  unitKey: string
  unitName: string
  barcode: string | null
  updatedAt: string
}) {
  return {
    id: row.id,
    kind: row.kind,
    name: row.name,
    sku: row.sku,
    hsnSac: row.hsnSac,
    salePricePaise: String(row.salePricePaise),
    mrpPaise: row.mrpPaise === null ? null : String(row.mrpPaise),
    purchasePricePaise: String(row.purchasePricePaise),
    trackStock: row.trackStock,
    active: row.active,
    unitKey: row.unitKey,
    unitName: row.unitName,
    barcode: row.barcode,
    updatedAt: row.updatedAt,
  }
}
