export type UserRecord = {
  pk: string
  sk: string
  entityType: 'user'
  id: string
  fullName: string
  email: string | null
  phoneE164: string | null
  passwordHash: string | null
  locale: string
  status: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type SessionRecord = {
  pk: string
  sk: string
  entityType: 'session'
  id: string
  userId: string
  refreshTokenHash: string
  familyId: string
  replacedBySessionId: string | null
  expiresAt: string
  revokedAt: string | null
  revokeReason: string | null
  userAgent: string | null
  ip: string | null
  platform: string | null
  createdAt: string
  lastUsedAt: string
}

export type BusinessRecord = {
  pk: string
  sk: string
  entityType: 'business'
  id: string
  ownerUserId: string
  legalName: string
  displayName: string
  categoryKey: string
  status: string
  databaseName: string
  schemaVersion: number
  region: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type MembershipRecord = {
  pk: string
  sk: string
  entityType: 'membership'
  id: string
  userId: string
  businessId: string
  status: string
  permVersion: number
  isDefault: boolean
  roleKey: string
  createdAt: string
  updatedAt: string
  gsi2pk: string
  gsi2sk: string
}

export type ProductRecord = {
  pk: string
  sk: string
  entityType: 'product'
  id: string
  businessId: string
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
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  gsi3pk: string
  gsi3sk: string
}

export type BillRecord = {
  pk: string
  sk: string
  entityType: 'bill'
  id: string
  businessId: string
  docType: string
  number: string
  status: string
  partyName: string | null
  totalPaise: number
  paidPaise: number
  balancePaise: number
  createdAt: string
  updatedAt: string
  gsi3pk: string
  gsi3sk: string
}

export type BillLineRecord = {
  pk: string
  sk: string
  entityType: 'bill_line'
  billId: string
  businessId: string
  lineNo: number
  productId: string | null
  name: string
  qty: number
  unitKey: string
  ratePaise: number
  lineTotalPaise: number
}

export type ShopMetaRecord = {
  pk: string
  sk: string
  entityType: 'shop_meta'
  businessId: string
  branchId: string
  branchName: string
  locationId: string
  counterId: string
  fyId: string
  fyLabel: string
  nextInvoice: number
  nextBos: number
}
