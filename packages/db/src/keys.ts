export const keys = {
  userPk: (userId: string) => `USER#${userId}`,
  userProfileSk: () => 'PROFILE',
  emailLookupPk: (email: string) => `LOOKUP#EMAIL#${email.toLowerCase()}`,
  phoneLookupPk: (phone: string) => `LOOKUP#PHONE#${phone}`,
  lookupSk: () => 'USER',
  sessionSk: (sessionId: string) => `SESSION#${sessionId}`,
  refreshLookupPk: (hash: string) => `LOOKUP#REFRESH#${hash}`,
  refreshLookupSk: () => 'SESSION',
  loginEventSk: (id: string) => `LOGIN#${id}`,
  bizPk: (businessId: string) => `BIZ#${businessId}`,
  bizProfileSk: () => 'PROFILE',
  memberSk: (userId: string) => `MEMBER#${userId}`,
  idempotencySk: (key: string) => `IDEM#${key}`,
  planPk: () => 'PLAN#free',
  planSk: () => 'PROFILE',
  subscriptionSk: () => 'SUBSCRIPTION',
  itemSk: (productId: string) => `ITEM#${productId}`,
  barcodeSk: (barcode: string) => `BARCODE#${barcode}`,
  billSk: (billId: string) => `BILL#${billId}`,
  billLineSk: (billId: string, line: number) => `BILL#${billId}#LINE#${String(line).padStart(4, '0')}`,
  shopMetaSk: () => 'META#SHOP',
  barcodeCachePk: (barcode: string) => `BARCACHE#${barcode}`,
  barcodeCacheSk: () => 'CACHE',
  gsi2UserPk: (userId: string) => `USER#${userId}`,
  gsi2MemberSk: (businessId: string) => `MEMBER#${businessId}`,
  gsi3EntityPk: (businessId: string, entity: string) => `BIZ#${businessId}#${entity}`,
}

export function assertBizPk(pk: string): void {
  if (!pk.startsWith('BIZ#')) {
    throw new Error('Tenant isolation failed: unexpected partition key')
  }
}
