import { Inject, Injectable } from '@nestjs/common'
import { bills } from '@billnote/db'
import { ok } from '../common/envelope.js'
import { TenantService } from '../tenant/tenant.service.js'

@Injectable()
export class DashboardService {
  constructor(@Inject(TenantService) private readonly tenants: TenantService) {}

  async today(userId: string, businessId: string | undefined) {
    return this.tenants.withTenant(userId, businessId, async (ctx) => {
      const stats = await bills.dashboardStats(ctx.businessId)
      return ok({
        todaySalesPaise: stats.salesTotalPaise,
        moneyInPaise: stats.moneyInPaise,
        receivablePaise: stats.receivablePaise,
        lowStockCount: Number(stats.lowStockCount),
        billCountToday: Number(stats.salesCount),
        recentBills: stats.recent.map((row) => ({
          id: row.id,
          displayNumber: row.number,
          status: row.status,
          grandTotalPaise: row.totalPaise,
          amountPaidPaise: row.totalPaise,
          balancePaise: '0',
          issuedOn: row.createdAt.slice(0, 10),
          confirmedAt: row.createdAt,
        })),
      })
    })
  }
}
