import { Inject, Injectable } from '@nestjs/common'
import { bills, products } from '@billnote/db'
import { fail, ok } from '../common/envelope.js'
import { TenantService } from '../tenant/tenant.service.js'

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

@Injectable()
export class DocumentsService {
  constructor(@Inject(TenantService) private readonly tenants: TenantService) {}

  async charge(userId: string, businessId: string | undefined, input: ChargeInput) {
    return this.tenants.withTenant(userId, businessId, async (ctx) => {
      if (!input.lines.length) {
        return fail('VALIDATION', 'Add at least one item to the bill.')
      }

      const built: Array<{
        productId: string
        name: string
        qty: number
        unitKey: string
        ratePaise: number
        lineTotalPaise: number
      }> = []

      for (const line of input.lines) {
        const product = await products.getProduct(ctx.businessId, line.productId)
        if (!product || !product.active) {
          return fail('VALIDATION', 'One of the items is missing or inactive.')
        }
        const qty = line.qtyMilli / 1000
        if (!(qty > 0)) return fail('VALIDATION', 'Quantity must be positive.')
        const rate = line.unitPricePaise ?? product.salePricePaise
        const discount = line.discountPaise ?? 0
        const lineTotal = Math.max(0, Math.round(qty * rate) - discount)
        built.push({
          productId: product.id,
          name: product.name,
          qty,
          unitKey: product.unitKey,
          ratePaise: rate,
          lineTotalPaise: lineTotal,
        })
      }

      const totalPaise = built.reduce((s, l) => s + l.lineTotalPaise, 0)
      const paidPaise =
        input.paymentMode === 'credit' || input.hold ? 0 : totalPaise

      const bill = await bills.createBill(ctx.businessId, {
        docType: 'tax_invoice',
        partyName: null,
        lines: built,
        paidPaise,
      })

      return ok({
        id: bill.id,
        displayNumber: bill.number,
        status: input.hold ? 'held' : bill.status,
        docType: bill.docType,
        grandTotalPaise: String(bill.totalPaise),
        amountPaidPaise: String(bill.paidPaise),
        balancePaise: String(bill.balancePaise),
        paymentMode: input.paymentMode,
        lines: built.map((l, i) => ({
          lineNo: i + 1,
          productId: l.productId,
          description: l.name,
          qty: l.qty,
          unitKey: l.unitKey,
          unitPricePaise: String(l.ratePaise),
          lineTotalPaise: String(l.lineTotalPaise),
        })),
      })
    })
  }

  async get(userId: string, businessId: string | undefined, id: string) {
    return this.tenants.withTenant(userId, businessId, async (ctx) => {
      const row = await bills.getBill(ctx.businessId, id)
      if (!row) return fail('NOT_FOUND', 'Bill not found.')
      return ok({
        id: row.bill.id,
        displayNumber: row.bill.number,
        status: row.bill.status,
        docType: row.bill.docType,
        grandTotalPaise: String(row.bill.totalPaise),
        amountPaidPaise: String(row.bill.paidPaise),
        balancePaise: String(row.bill.balancePaise),
        partyName: row.bill.partyName,
        lines: row.lines.map((l) => ({
          lineNo: l.lineNo,
          productId: l.productId,
          description: l.name,
          qty: l.qty,
          unitKey: l.unitKey,
          unitPricePaise: String(l.ratePaise),
          lineTotalPaise: String(l.lineTotalPaise),
        })),
      })
    })
  }

  async receiptHtml(userId: string, businessId: string | undefined, id: string) {
    return this.tenants.withTenant(userId, businessId, async (ctx) => {
      const row = await bills.getBill(ctx.businessId, id)
      if (!row) return fail('NOT_FOUND', 'Bill not found.')
      const lines = row.lines
        .map(
          (l) =>
            `<tr><td>${escapeHtml(l.name)}</td><td>${l.qty}</td><td>${(l.ratePaise / 100).toFixed(2)}</td><td>${(l.lineTotalPaise / 100).toFixed(2)}</td></tr>`,
        )
        .join('')
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(row.bill.number)}</title>
<style>body{font-family:system-ui,sans-serif;padding:16px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:6px;text-align:left}</style>
</head><body>
<h1>${escapeHtml(ctx.displayName)}</h1>
<p>${escapeHtml(row.bill.number)} · ${escapeHtml(row.bill.status)}</p>
<table><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead><tbody>${lines}</tbody></table>
<p><strong>Total ₹${(row.bill.totalPaise / 100).toFixed(2)}</strong></p>
</body></html>`
      return ok({ html })
    })
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
