import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import type { Client } from 'pg'
import { getControlDb } from '@billnote/db'
import { fail, ok } from '../common/envelope.js'
import { TenantService } from '../tenant/tenant.service.js'

export type ProductRow = {
  id: string
  kind: string
  name: string
  sku: string | null
  hsn_sac: string | null
  sale_price_paise: string
  mrp_paise: string | null
  purchase_price_paise: string
  track_stock: boolean
  active: boolean
  unit_key: string
  unit_name: string
  barcode: string | null
  updated_at: Date
}

@Injectable()
export class ProductsService {
  constructor(@Inject(TenantService) private readonly tenants: TenantService) {}

  async list(userId: string, businessId: string | undefined, q?: string) {
    return this.tenants.withTenantClient(userId, businessId, async (client) => {
      const params: unknown[] = []
      let where = `p.deleted_at IS NULL AND p.active = true`
      if (q?.trim()) {
        params.push(`%${q.trim()}%`)
        where += ` AND (
          p.name ILIKE $1 OR COALESCE(p.sku, '') ILIKE $1 OR EXISTS (
            SELECT 1 FROM product_barcodes b
            WHERE b.product_id = p.id AND b.deleted_at IS NULL AND b.barcode ILIKE $1
          )
        )`
      }
      const result = await client.query<ProductRow>(
        `SELECT p.id, p.kind, p.name, p.sku, p.hsn_sac,
                p.sale_price_paise::text, p.mrp_paise::text, p.purchase_price_paise::text,
                p.track_stock, p.active, u.key AS unit_key, u.name AS unit_name,
                (
                  SELECT b.barcode FROM product_barcodes b
                  WHERE b.product_id = p.id AND b.deleted_at IS NULL
                  ORDER BY b.is_primary DESC, b.created_at ASC
                  LIMIT 1
                ) AS barcode,
                p.updated_at
         FROM products p
         JOIN units u ON u.id = p.unit_id
         WHERE ${where}
         ORDER BY p.name ASC
         LIMIT 200`,
        params,
      )
      return ok(result.rows.map(mapProduct))
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
    return this.tenants.withTenantClient(userId, businessId, async (client) => {
      const name = input.name.trim()
      if (!name) return fail('VALIDATION', 'Item name is required.')
      if (!Number.isInteger(input.salePricePaise) || input.salePricePaise < 0) {
        return fail('VALIDATION', 'Sale price must be a whole number of paise.')
      }

      const unit = await client.query<{ id: string }>(
        `SELECT id FROM units WHERE key = $1 LIMIT 1`,
        [input.unitKey ?? 'pcs'],
      )
      if (!unit.rows[0]) return fail('VALIDATION', 'Unknown unit.')

      if (input.barcode?.trim()) {
        const clash = await client.query(
          `SELECT 1 FROM product_barcodes WHERE barcode = $1 AND deleted_at IS NULL LIMIT 1`,
          [input.barcode.trim()],
        )
        if ((clash.rowCount ?? 0) > 0) {
          return fail('CONFLICT', 'That barcode is already on another item.')
        }
      }

      const id = randomUUID()
      await client.query('BEGIN')
      try {
        await client.query(
          `INSERT INTO products (
             id, kind, name, sku, hsn_sac, unit_id,
             mrp_paise, sale_price_paise, purchase_price_paise, track_stock
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            id,
            input.kind ?? 'product',
            name,
            input.sku?.trim() || null,
            input.hsnSac?.trim() || null,
            unit.rows[0].id,
            input.mrpPaise ?? null,
            input.salePricePaise,
            input.purchasePricePaise ?? 0,
            input.trackStock ?? true,
          ],
        )

        if (input.barcode?.trim()) {
          await client.query(
            `INSERT INTO product_barcodes (id, product_id, barcode, symbology, is_primary)
             VALUES ($1,$2,$3,$4,true)`,
            [randomUUID(), id, input.barcode.trim(), guessSymbology(input.barcode.trim())],
          )
        }

        await client.query('COMMIT')
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      }

      const created = await this.getById(client, id)
      return ok(created)
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
    return this.tenants.withTenantClient(userId, businessId, async (client) => {
      const existing = await client.query(`SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL`, [
        productId,
      ])
      if (!existing.rows[0]) return fail('NOT_FOUND', 'Item not found.')

      const sets: string[] = []
      const params: unknown[] = []
      const push = (sql: string, value: unknown) => {
        params.push(value)
        sets.push(`${sql} = $${params.length}`)
      }

      if (input.name !== undefined) push('name', input.name.trim())
      if (input.salePricePaise !== undefined) push('sale_price_paise', input.salePricePaise)
      if (input.mrpPaise !== undefined) push('mrp_paise', input.mrpPaise)
      if (input.purchasePricePaise !== undefined) {
        push('purchase_price_paise', input.purchasePricePaise)
      }
      if (input.sku !== undefined) push('sku', input.sku?.trim() || null)
      if (input.hsnSac !== undefined) push('hsn_sac', input.hsnSac?.trim() || null)
      if (input.active !== undefined) push('active', input.active)
      if (input.trackStock !== undefined) push('track_stock', input.trackStock)

      if (sets.length) {
        params.push(productId)
        await client.query(
          `UPDATE products SET ${sets.join(', ')}, updated_at = now(), version = version + 1
           WHERE id = $${params.length}`,
          params,
        )
      }

      if (input.barcode !== undefined) {
        const barcode = input.barcode?.trim() || null
        await client.query(
          `UPDATE product_barcodes SET deleted_at = now()
           WHERE product_id = $1 AND deleted_at IS NULL`,
          [productId],
        )
        if (barcode) {
          const clash = await client.query(
            `SELECT 1 FROM product_barcodes
             WHERE barcode = $1 AND deleted_at IS NULL AND product_id <> $2 LIMIT 1`,
            [barcode, productId],
          )
          if ((clash.rowCount ?? 0) > 0) {
            return fail('CONFLICT', 'That barcode is already on another item.')
          }
          await client.query(
            `INSERT INTO product_barcodes (id, product_id, barcode, symbology, is_primary)
             VALUES ($1,$2,$3,$4,true)`,
            [randomUUID(), productId, barcode, guessSymbology(barcode)],
          )
        }
      }

      return ok(await this.getById(client, productId))
    })
  }

  async softDelete(userId: string, businessId: string | undefined, productId: string) {
    return this.tenants.withTenantClient(userId, businessId, async (client) => {
      const result = await client.query(
        `UPDATE products SET deleted_at = now(), active = false, updated_at = now()
         WHERE id = $1 AND deleted_at IS NULL
         RETURNING id`,
        [productId],
      )
      if (!result.rows[0]) return fail('NOT_FOUND', 'Item not found.')
      await client.query(
        `UPDATE product_barcodes SET deleted_at = now()
         WHERE product_id = $1 AND deleted_at IS NULL`,
        [productId],
      )
      return ok({ id: productId, deleted: true })
    })
  }

  async lookupBarcode(userId: string, businessId: string | undefined, barcodeRaw: string) {
    const barcode = barcodeRaw.trim()
    if (!barcode) return fail('VALIDATION', 'Barcode is required.')

    return this.tenants.withTenantClient(userId, businessId, async (client) => {
      const local = await client.query<{ product_id: string }>(
        `SELECT product_id FROM product_barcodes
         WHERE barcode = $1 AND deleted_at IS NULL LIMIT 1`,
        [barcode],
      )
      if (local.rows[0]) {
        const product = await this.getById(client, local.rows[0].product_id)
        return ok({ source: 'tenant' as const, product, suggestion: null })
      }

      const suggestion = await this.lookupExternal(barcode)
      return ok({ source: suggestion ? suggestion.source : ('none' as const), product: null, suggestion })
    })
  }

  private async getById(client: Client, id: string) {
    const result = await client.query<ProductRow>(
      `SELECT p.id, p.kind, p.name, p.sku, p.hsn_sac,
              p.sale_price_paise::text, p.mrp_paise::text, p.purchase_price_paise::text,
              p.track_stock, p.active, u.key AS unit_key, u.name AS unit_name,
              (
                SELECT b.barcode FROM product_barcodes b
                WHERE b.product_id = p.id AND b.deleted_at IS NULL
                ORDER BY b.is_primary DESC, b.created_at ASC
                LIMIT 1
              ) AS barcode,
              p.updated_at
       FROM products p
       JOIN units u ON u.id = p.unit_id
       WHERE p.id = $1`,
      [id],
    )
    const row = result.rows[0]
    if (!row) throw new Error('Product row missing after write')
    return mapProduct(row)
  }

  private async lookupExternal(barcode: string) {
    const db = getControlDb()
    const cached = await db.barcodeLookupCache.findUnique({ where: { barcode } })
    if (cached && cached.expiresAt > new Date()) {
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
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      await db.barcodeLookupCache.upsert({
        where: { barcode },
        create: {
          barcode,
          payload: suggestion,
          source: 'open_food_facts',
          fetchedAt: new Date(),
          expiresAt,
        },
        update: {
          payload: suggestion,
          source: 'open_food_facts',
          fetchedAt: new Date(),
          expiresAt,
        },
      })
      return suggestion
    } catch {
      return null
    }
  }
}

function mapProduct(row: ProductRow) {
  return {
    id: row.id,
    kind: row.kind,
    name: row.name,
    sku: row.sku,
    hsnSac: row.hsn_sac,
    salePricePaise: row.sale_price_paise,
    mrpPaise: row.mrp_paise,
    purchasePricePaise: row.purchase_price_paise,
    trackStock: row.track_stock,
    active: row.active,
    unitKey: row.unit_key,
    unitName: row.unit_name,
    barcode: row.barcode,
    updatedAt: row.updated_at,
  }
}

function guessSymbology(barcode: string): string {
  if (/^\d{13}$/.test(barcode)) return 'ean13'
  if (/^\d{8}$/.test(barcode)) return 'ean8'
  if (/^\d{12}$/.test(barcode)) return 'upca'
  if (/^\d{6,8}$/.test(barcode)) return 'upce'
  return 'unknown'
}
