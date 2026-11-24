const CROCKFORD = '0123456789abcdefghjkmnpqrstvwxyz'

/** Database name: bn_ + Crockford base32 of the business uuid, lowercase. */
export function createTenantDatabaseName(businessId: string): string {
  const hex = businessId.replace(/-/g, '').toLowerCase()
  if (!/^[0-9a-f]{32}$/.test(hex)) {
    throw new Error('businessId must be a UUID')
  }

  let bits = ''
  for (const ch of hex) {
    bits += Number.parseInt(ch, 16).toString(2).padStart(4, '0')
  }

  let out = ''
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    const slice = bits.slice(i, i + 5)
    out += CROCKFORD[Number.parseInt(slice, 2)]
  }

  return `bn_${out}`
}
