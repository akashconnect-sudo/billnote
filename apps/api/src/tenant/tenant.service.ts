import { Injectable } from '@nestjs/common'
import { businesses, type BusinessRecord, type MembershipRecord } from '@billnote/db'
import { fail } from '../common/envelope.js'

export type TenantContext = {
  businessId: string
  legalName: string
  displayName: string
  categoryKey: string
  userId: string
  membership: MembershipRecord
  business: BusinessRecord
}

@Injectable()
export class TenantService {
  async withTenant<T>(
    userId: string,
    businessId: string | undefined,
    run: (ctx: TenantContext) => Promise<T>,
  ): Promise<T | ReturnType<typeof fail>> {
    const membership = businessId
      ? await businesses.getMembership(businessId, userId)
      : await businesses.getDefaultMembership(userId)

    if (!membership || membership.status !== 'active') {
      return fail('TENANT_REQUIRED', 'Create or select a shop first.')
    }

    const business = await businesses.getBusiness(membership.businessId)
    if (!business) {
      return fail('TENANT_REQUIRED', 'Create or select a shop first.')
    }
    if (business.status !== 'ready') {
      return fail(
        'TENANT_NOT_READY',
        'This shop is still being set up. Please wait a moment.',
      )
    }
    if (!business.pk.startsWith('BIZ#')) {
      return fail('TENANT_ISOLATION', 'Tenant isolation check failed.')
    }

    return run({
      businessId: membership.businessId,
      legalName: business.legalName,
      displayName: business.displayName,
      categoryKey: business.categoryKey,
      userId,
      membership,
      business,
    })
  }

  /** @deprecated Use withTenant — kept name for gradual call-site updates */
  async withTenantClient<T>(
    userId: string,
    businessId: string | undefined,
    run: (unused: null, ctx: TenantContext) => Promise<T>,
  ): Promise<T | ReturnType<typeof fail>> {
    return this.withTenant(userId, businessId, (ctx) => run(null, ctx))
  }
}
