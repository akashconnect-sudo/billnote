import { Inject, Injectable } from '@nestjs/common'
import { ok } from '../common/envelope.js'
import { TenantService } from '../tenant/tenant.service.js'

@Injectable()
export class DashboardService {
  constructor(@Inject(TenantService) private readonly tenants: TenantService) {}

  async today(userId: string, businessId: string | undefined) {
    return this.tenants.withTenantClient(userId, businessId, async (client) => {
      const sales = await client.query<{ total: string; count: string }>(
        `SELECT COALESCE(SUM(grand_total_paise), 0)::text AS total,
                COUNT(*)::text AS count
         FROM documents
         WHERE deleted_at IS NULL
           AND status IN ('confirmed', 'partially_paid', 'paid')
           AND issued_on = CURRENT_DATE`,
      )

      const moneyIn = await client.query<{ total: string }>(
        `SELECT COALESCE(SUM(amount_paise), 0)::text AS total
         FROM payments
         WHERE direction = 'in' AND paid_on = CURRENT_DATE`,
      )

      const receivable = await client.query<{ total: string }>(
        `SELECT COALESCE(SUM(balance_paise), 0)::text AS total
         FROM documents
         WHERE deleted_at IS NULL
           AND status IN ('confirmed', 'partially_paid', 'paid')
           AND balance_paise > 0`,
      )

      const lowStock = await client.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count
         FROM stock_balances sb
         JOIN products p ON p.id = sb.product_id
         WHERE p.deleted_at IS NULL AND p.track_stock = true
           AND sb.qty_milli <= p.reorder_milli`,
      )

      const recent = await client.query(
        `SELECT id, display_number, status,
                grand_total_paise::text, amount_paid_paise::text, balance_paise::text,
                issued_on, confirmed_at
         FROM documents
         WHERE deleted_at IS NULL
           AND status IN ('confirmed', 'partially_paid', 'paid', 'held')
         ORDER BY COALESCE(confirmed_at, created_at) DESC
         LIMIT 20`,
      )

      return ok({
        todaySalesPaise: sales.rows[0]?.total ?? '0',
        moneyInPaise: moneyIn.rows[0]?.total ?? '0',
        receivablePaise: receivable.rows[0]?.total ?? '0',
        lowStockCount: Number(lowStock.rows[0]?.count ?? '0'),
        billCountToday: Number(sales.rows[0]?.count ?? '0'),
        recentBills: recent.rows.map((row) => {
          const r = row as Record<string, unknown>
          return {
            id: r.id as string,
            displayNumber: (r.display_number as string | null) ?? null,
            status: r.status as string,
            grandTotalPaise: String(r.grand_total_paise),
            amountPaidPaise: String(r.amount_paid_paise),
            balancePaise: String(r.balance_paise),
            issuedOn: r.issued_on,
            confirmedAt: r.confirmed_at,
          }
        }),
      })
    })
  }
}
