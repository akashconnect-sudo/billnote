import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import type { Client } from 'pg'
import {
  computeLineTax,
  formatPaise,
  milli,
  paise,
  sumDocumentTotals,
  type PriceMode,
  type RoundOffMode,
  type SupplyType,
} from '@billnote/shared'
import { fail, ok } from '../common/envelope.js'
import { TenantService, type TenantContext } from '../tenant/tenant.service.js'

export type PosLineInput = {
  productId: string
  qtyMilli: number
  unitPricePaise?: number
  discountPaise?: number
}

export type ChargeInput = {
  lines: PosLineInput[]
  paymentMode: 'cash' | 'upi' | 'card' | 'credit'
  hold?: boolean
  notes?: string
  idempotencyKey?: string
}

type ShopSettings = {
  branchId: string
  locationId: string
  counterId: string | null
  staffId: string | null
  stateCode: string
  priceMode: PriceMode
  roundOffMode: RoundOffMode
  gstRegistered: boolean
  composition: boolean
  displayName: string
  legalName: string
  fyId: string
  fyLabel: string
}

type BuiltLine = {
  productId: string
  description: string
  hsnSac: string | null
  unitId: string
  qtyMilli: bigint
  unitPricePaise: bigint
  taxRateBps: number
  cessBps: number
  tax: ReturnType<typeof computeLineTax>
}

@Injectable()
export class DocumentsService {
  constructor(@Inject(TenantService) private readonly tenants: TenantService) {}

  async charge(userId: string, businessId: string | undefined, input: ChargeInput) {
    return this.tenants.withTenantClient(userId, businessId, async (client, ctx) => {
      if (!input.lines.length) {
        return fail('VALIDATION', 'Add at least one item to the bill.')
      }

      if (input.idempotencyKey) {
        const existing = await client.query<{ id: string }>(
          `SELECT id FROM documents WHERE idempotency_key = $1 AND deleted_at IS NULL LIMIT 1`,
          [input.idempotencyKey],
        )
        if (existing.rows[0]) {
          return ok(await this.getDocumentPayload(client, existing.rows[0].id, ctx))
        }
      }

      const shop = await this.loadShop(client, ctx)
      const built = await this.buildLines(client, input.lines, shop)
      if ('error' in built) return built.error

      const supplyType: SupplyType = 'intra'
      const docType = shop.gstRegistered && !shop.composition ? 'tax_invoice' : 'bill_of_supply'
      const totals = sumDocumentTotals(
        built.lines.map((l) => l.tax),
        shop.roundOffMode,
      )

      const documentId = randomUUID()
      const status = input.hold ? 'held' : 'draft'

      await client.query('BEGIN')
      try {
        await client.query(
          `INSERT INTO documents (
             id, doc_type, status, fy_id, branch_id, counter_id, staff_id,
             place_of_supply_state, supply_type, price_mode, reverse_charge, is_composition,
             subtotal_paise, discount_paise, taxable_paise,
             cgst_paise, sgst_paise, igst_paise, cess_paise, round_off_paise,
             grand_total_paise, amount_paid_paise, balance_paise,
             notes, idempotency_key
           ) VALUES (
             $1,$2,$3,$4,$5,$6,$7,
             $8,$9,$10,false,$11,
             $12,$13,$14,
             $15,$16,$17,$18,$19,
             $20,0,$20,
             $21,$22
           )`,
          [
            documentId,
            docType,
            status,
            shop.fyId,
            shop.branchId,
            shop.counterId,
            shop.staffId,
            shop.stateCode,
            supplyType,
            shop.priceMode,
            shop.composition,
            totals.subtotalPaise.toString(),
            totals.discountPaise.toString(),
            totals.taxablePaise.toString(),
            totals.cgstPaise.toString(),
            totals.sgstPaise.toString(),
            totals.igstPaise.toString(),
            totals.cessPaise.toString(),
            totals.roundOffPaise.toString(),
            totals.grandTotalPaise.toString(),
            input.notes ?? null,
            input.idempotencyKey ?? null,
          ],
        )

        let lineNo = 1
        for (const line of built.lines) {
          await client.query(
            `INSERT INTO document_lines (
               id, document_id, line_no, product_id, description, hsn_sac, unit_id,
               qty_milli, unit_price_paise, discount_paise, tax_rate_bps, cess_bps,
               taxable_paise, cgst_paise, sgst_paise, igst_paise, cess_paise, line_total_paise
             ) VALUES (
               $1,$2,$3,$4,$5,$6,$7,
               $8,$9,$10,$11,$12,
               $13,$14,$15,$16,$17,$18
             )`,
            [
              randomUUID(),
              documentId,
              lineNo++,
              line.productId,
              line.description,
              line.hsnSac,
              line.unitId,
              line.qtyMilli.toString(),
              line.unitPricePaise.toString(),
              line.tax.discountPaise.toString(),
              line.taxRateBps,
              line.cessBps,
              line.tax.taxablePaise.toString(),
              line.tax.cgstPaise.toString(),
              line.tax.sgstPaise.toString(),
              line.tax.igstPaise.toString(),
              line.tax.cessPaise.toString(),
              line.tax.lineTotalPaise.toString(),
            ],
          )
        }

        if (!input.hold) {
          await this.confirmInTx(client, documentId, shop, input.paymentMode, totals.grandTotalPaise)
        }

        await client.query('COMMIT')
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      }

      return ok(await this.getDocumentPayload(client, documentId, ctx))
    })
  }

  async get(userId: string, businessId: string | undefined, documentId: string) {
    return this.tenants.withTenantClient(userId, businessId, async (client, ctx) => {
      const payload = await this.getDocumentPayload(client, documentId, ctx)
      if (!payload) return fail('NOT_FOUND', 'Bill not found.')
      return ok(payload)
    })
  }

  async receiptHtml(userId: string, businessId: string | undefined, documentId: string) {
    return this.tenants.withTenantClient(userId, businessId, async (client, ctx) => {
      const payload = await this.getDocumentPayload(client, documentId, ctx)
      if (!payload) return fail('NOT_FOUND', 'Bill not found.')
      return ok({ html: renderReceiptHtml(payload), documentId })
    })
  }

  private async confirmInTx(
    client: Client,
    documentId: string,
    shop: ShopSettings,
    paymentMode: ChargeInput['paymentMode'],
    grandTotal: bigint,
  ) {
    const doc = await client.query<{ doc_type: string; fy_id: string }>(
      `SELECT doc_type, fy_id FROM documents WHERE id = $1 FOR UPDATE`,
      [documentId],
    )
    const series = await client.query<{ id: string; prefix: string; next_number: number; pad_width: number }>(
      `SELECT id, prefix, next_number, pad_width FROM invoice_series
       WHERE fy_id = $1 AND doc_type = $2 AND branch_id IS NULL AND gst_registration_id IS NULL
       FOR UPDATE`,
      [doc.rows[0]!.fy_id, doc.rows[0]!.doc_type],
    )
    if (!series.rows[0]) throw new Error('Invoice series missing')

    const number = series.rows[0].next_number
    const display = `${series.rows[0].prefix}/${shop.fyLabel}/${String(number).padStart(series.rows[0].pad_width, '0')}`
    await client.query(
      `UPDATE invoice_series SET next_number = next_number + 1 WHERE id = $1`,
      [series.rows[0].id],
    )

    const paid = paymentMode === 'credit' ? 0n : grandTotal
    const balance = grandTotal - paid
    const status =
      paymentMode === 'credit' ? 'confirmed' : balance === 0n ? 'paid' : 'partially_paid'

    await client.query(
      `UPDATE documents SET
         series_id = $2,
         number = $3,
         display_number = $4,
         status = $5,
         amount_paid_paise = $6,
         balance_paise = $7,
         issued_on = CURRENT_DATE,
         confirmed_at = now(),
         version = version + 1
       WHERE id = $1`,
      [
        documentId,
        series.rows[0].id,
        number,
        display,
        status,
        paid.toString(),
        balance.toString(),
      ],
    )

    if (paymentMode !== 'credit' && paid > 0n) {
      const paymentId = randomUUID()
      await client.query(
        `INSERT INTO payments (id, direction, mode, amount_paise, paid_on, staff_id)
         VALUES ($1, 'in', $2, $3, CURRENT_DATE, $4)`,
        [paymentId, paymentMode, paid.toString(), shop.staffId],
      )
      await client.query(
        `INSERT INTO payment_allocations (payment_id, document_id, amount_paise)
         VALUES ($1, $2, $3)`,
        [paymentId, documentId, paid.toString()],
      )
    }

    const lines = await client.query<{
      id: string
      product_id: string
      qty_milli: string
      line_total_paise: string
      track_stock: boolean
    }>(
      `SELECT dl.id, dl.product_id, dl.qty_milli::text, dl.line_total_paise::text, p.track_stock
       FROM document_lines dl
       JOIN products p ON p.id = dl.product_id
       WHERE dl.document_id = $1`,
      [documentId],
    )

    for (const line of lines.rows) {
      if (!line.track_stock) continue
      const qty = BigInt(line.qty_milli)
      await client.query(
        `INSERT INTO stock_movements (
           id, product_id, branch_id, location_id, qty_milli, value_paise, reason, document_id, line_id, created_by
         ) VALUES ($1,$2,$3,$4,$5,$6,'sale',$7,$8,$9)`,
        [
          randomUUID(),
          line.product_id,
          shop.branchId,
          shop.locationId,
          (-qty).toString(),
          (-BigInt(line.line_total_paise)).toString(),
          documentId,
          line.id,
          shop.staffId,
        ],
      )
      await client.query(
        `INSERT INTO stock_balances (product_id, branch_id, location_id, qty_milli, value_paise)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (product_id, variant_id, branch_id, location_id, batch_id)
         DO UPDATE SET
           qty_milli = stock_balances.qty_milli + EXCLUDED.qty_milli,
           value_paise = stock_balances.value_paise + EXCLUDED.value_paise`,
        [
          line.product_id,
          shop.branchId,
          shop.locationId,
          (-qty).toString(),
          (-BigInt(line.line_total_paise)).toString(),
        ],
      )
    }
  }

  private async buildLines(client: Client, lines: PosLineInput[], shop: ShopSettings) {
    const built: BuiltLine[] = []
    for (const line of lines) {
      if (!Number.isInteger(line.qtyMilli) || line.qtyMilli <= 0) {
        return { error: fail('VALIDATION', 'Quantity must be a positive milli amount.') }
      }
      const product = await client.query<{
        id: string
        name: string
        hsn_sac: string | null
        unit_id: string
        sale_price_paise: string
        rate_bps: number | null
        cess_bps: number | null
      }>(
        `SELECT p.id, p.name, p.hsn_sac, p.unit_id, p.sale_price_paise::text,
                t.rate_bps, t.cess_bps
         FROM products p
         LEFT JOIN tax_rates t ON t.id = p.tax_rate_id
         WHERE p.id = $1 AND p.deleted_at IS NULL AND p.active = true`,
        [line.productId],
      )
      if (!product.rows[0]) {
        return { error: fail('NOT_FOUND', 'One of the items was not found.') }
      }
      const row = product.rows[0]
      const unitPrice =
        line.unitPricePaise !== undefined
          ? BigInt(line.unitPricePaise)
          : BigInt(row.sale_price_paise)
      const gstBps = shop.gstRegistered && !shop.composition ? (row.rate_bps ?? 0) : 0
      const cessBps = shop.gstRegistered && !shop.composition ? (row.cess_bps ?? 0) : 0
      const tax = computeLineTax({
        qtyMilli: milli(line.qtyMilli),
        unitPricePaise: paise(unitPrice),
        discountPaise: paise(line.discountPaise ?? 0),
        gstBps,
        cessBps,
        priceMode: shop.priceMode,
        supplyType: 'intra',
      })
      built.push({
        productId: row.id,
        description: row.name,
        hsnSac: row.hsn_sac,
        unitId: row.unit_id,
        qtyMilli: BigInt(line.qtyMilli),
        unitPricePaise: unitPrice,
        taxRateBps: gstBps,
        cessBps,
        tax,
      })
    }
    return { lines: built }
  }

  private async loadShop(client: Client, ctx: TenantContext): Promise<ShopSettings> {
    const profile = await client.query<{
      price_mode: PriceMode
      round_off_mode: RoundOffMode
      gst_registered: boolean
      composition_scheme: boolean
      state_code: string | null
      display_name: string
      legal_name: string
    }>(`SELECT price_mode, round_off_mode, gst_registered, composition_scheme, state_code, display_name, legal_name
        FROM business_profile WHERE id = 1`)
    const branch = await client.query<{ id: string; state_code: string }>(
      `SELECT id, state_code FROM branches WHERE deleted_at IS NULL ORDER BY is_default DESC LIMIT 1`,
    )
    const location = await client.query<{ id: string }>(
      `SELECT id FROM stock_locations WHERE branch_id = $1 ORDER BY is_default DESC LIMIT 1`,
      [branch.rows[0]!.id],
    )
    const counter = await client.query<{ id: string }>(
      `SELECT id FROM counters WHERE branch_id = $1 LIMIT 1`,
      [branch.rows[0]!.id],
    )
    const staff = await client.query<{ id: string }>(
      `SELECT id FROM staff WHERE user_id = $1 AND deleted_at IS NULL LIMIT 1`,
      [ctx.userId],
    )
    const fy = await client.query<{ id: string; label: string }>(
      `SELECT id, label FROM financial_years WHERE status = 'open' ORDER BY starts_on DESC LIMIT 1`,
    )
    const p = profile.rows[0]!
    return {
      branchId: branch.rows[0]!.id,
      locationId: location.rows[0]!.id,
      counterId: counter.rows[0]?.id ?? null,
      staffId: staff.rows[0]?.id ?? null,
      stateCode: p.state_code ?? branch.rows[0]!.state_code,
      priceMode: p.price_mode,
      roundOffMode: p.round_off_mode,
      gstRegistered: p.gst_registered,
      composition: p.composition_scheme,
      displayName: p.display_name,
      legalName: p.legal_name,
      fyId: fy.rows[0]!.id,
      fyLabel: fy.rows[0]!.label,
    }
  }

  private async getDocumentPayload(client: Client, documentId: string, ctx: TenantContext) {
    const doc = await client.query(
      `SELECT d.*, bp.display_name AS shop_name, bp.legal_name AS shop_legal_name
       FROM documents d
       CROSS JOIN business_profile bp
       WHERE d.id = $1 AND d.deleted_at IS NULL`,
      [documentId],
    )
    if (!doc.rows[0]) return null
    const lines = await client.query(
      `SELECT id, line_no, product_id, description, hsn_sac, qty_milli::text, unit_price_paise::text,
              discount_paise::text, tax_rate_bps, taxable_paise::text, cgst_paise::text, sgst_paise::text,
              igst_paise::text, cess_paise::text, line_total_paise::text
       FROM document_lines WHERE document_id = $1 ORDER BY line_no`,
      [documentId],
    )
    const row = doc.rows[0] as Record<string, unknown>
    return {
      id: row.id as string,
      businessId: ctx.businessId,
      docType: row.doc_type as string,
      status: row.status as string,
      displayNumber: (row.display_number as string | null) ?? null,
      shopName: row.shop_name as string,
      shopLegalName: row.shop_legal_name as string,
      supplyType: row.supply_type as string,
      priceMode: row.price_mode as string,
      subtotalPaise: String(row.subtotal_paise),
      discountPaise: String(row.discount_paise),
      taxablePaise: String(row.taxable_paise),
      cgstPaise: String(row.cgst_paise),
      sgstPaise: String(row.sgst_paise),
      igstPaise: String(row.igst_paise),
      cessPaise: String(row.cess_paise),
      roundOffPaise: String(row.round_off_paise),
      grandTotalPaise: String(row.grand_total_paise),
      amountPaidPaise: String(row.amount_paid_paise),
      balancePaise: String(row.balance_paise),
      issuedOn: row.issued_on,
      confirmedAt: row.confirmed_at,
      lines: lines.rows.map((l) => {
        const line = l as Record<string, unknown>
        return {
          id: line.id as string,
          lineNo: line.line_no as number,
          productId: line.product_id as string,
          description: line.description as string,
          hsnSac: line.hsn_sac as string | null,
          qtyMilli: String(line.qty_milli),
          unitPricePaise: String(line.unit_price_paise),
          discountPaise: String(line.discount_paise),
          taxRateBps: line.tax_rate_bps as number,
          taxablePaise: String(line.taxable_paise),
          cgstPaise: String(line.cgst_paise),
          sgstPaise: String(line.sgst_paise),
          igstPaise: String(line.igst_paise),
          cessPaise: String(line.cess_paise),
          lineTotalPaise: String(line.line_total_paise),
        }
      }),
    }
  }
}

function renderReceiptHtml(doc: NonNullable<Awaited<ReturnType<DocumentsService['getDocumentPayload']>>>) {
  const lines = doc.lines
    .map(
      (l) =>
        `<tr>
          <td>${escapeHtml(l.description)}</td>
          <td style="text-align:right">${(Number(l.qtyMilli) / 1000).toFixed(l.qtyMilli.endsWith('000') ? 0 : 3)}</td>
          <td style="text-align:right">${formatPaise(paise(l.unitPricePaise))}</td>
          <td style="text-align:right">${formatPaise(paise(l.lineTotalPaise))}</td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(doc.displayNumber ?? 'Bill')} — BILLNOTE</title>
  <style>
    body { font-family: Figtree, Segoe UI, sans-serif; color: #1f1a17; margin: 24px; }
    h1 { font-family: "Source Serif 4", Georgia, serif; color: #0b6e4f; margin: 0 0 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 8px 6px; border-bottom: 1px solid #e2d9ce; font-size: 14px; }
    th { text-align: left; color: #5c534c; font-weight: 600; }
    .meta { color: #5c534c; font-size: 14px; }
    .total { font-size: 20px; font-weight: 700; margin-top: 16px; }
    @media print { button { display: none; } body { margin: 12px; } }
  </style>
</head>
<body>
  <button onclick="window.print()">Print / Save PDF</button>
  <h1>${escapeHtml(doc.shopName)}</h1>
  <div class="meta">${escapeHtml(doc.shopLegalName)}</div>
  <div class="meta">${escapeHtml(doc.displayNumber ?? 'Draft')} · ${escapeHtml(doc.status)}</div>
  <table>
    <thead><tr><th>Item</th><th style="text-align:right">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>${lines}</tbody>
  </table>
  <div class="total">Total ${formatPaise(paise(doc.grandTotalPaise))}</div>
  <div class="meta">Paid ${formatPaise(paise(doc.amountPaidPaise))} · Balance ${formatPaise(paise(doc.balancePaise))}</div>
  <p class="meta">Made with BILLNOTE</p>
</body>
</html>`
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
