/** Money is always integer paise. Never use JavaScript number for money. */
export type Paise = bigint & { readonly __brand: 'Paise' }

/** Quantity is always integer milli-units (1000 = 1 whole unit). */
export type Milli = bigint & { readonly __brand: 'Milli' }

export function paise(value: bigint | number | string): Paise {
  return BigInt(value) as Paise
}

export function milli(value: bigint | number | string): Milli {
  return BigInt(value) as Milli
}

/**
 * Integer division with half away from zero.
 * Example: 181 / 2 → 91; -181 / 2 → -91.
 */
export function divRoundHalfAway(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) {
    throw new Error('Division by zero')
  }

  const negative = numerator < 0n !== denominator < 0n
  const n = numerator < 0n ? -numerator : numerator
  const d = denominator < 0n ? -denominator : denominator
  const quotient = n / d
  const remainder = n % d
  const rounded = remainder * 2n >= d ? quotient + 1n : quotient
  return negative ? -rounded : rounded
}

export function formatPaise(amount: Paise, locale = 'en-IN'): string {
  const negative = amount < 0n
  const absolute = negative ? -amount : amount
  const rupees = absolute / 100n
  const fraction = absolute % 100n
  const whole = Number(rupees)
  const grouped = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(whole)
  const fractionText = fraction.toString().padStart(2, '0')
  const body = `${grouped}.${fractionText}`
  return negative ? `-₹${body}` : `₹${body}`
}

export function parseRupeesToPaise(input: string): Paise {
  const cleaned = input.replace(/[₹,\s]/g, '').trim()
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) {
    throw new Error('Enter an amount like 118 or 118.50')
  }
  const negative = cleaned.startsWith('-')
  const [rupeesPart = '0', fractionPart = '0'] = cleaned.replace('-', '').split('.')
  const fraction = (fractionPart + '00').slice(0, 2)
  const value = BigInt(rupeesPart) * 100n + BigInt(fraction)
  return paise(negative ? -value : value)
}

export function milliToDisplay(qty: Milli, decimals = 3): string {
  const negative = qty < 0n
  const absolute = negative ? -qty : qty
  const whole = absolute / 1000n
  const fraction = (absolute % 1000n).toString().padStart(3, '0').slice(0, decimals)
  const body = decimals > 0 ? `${whole.toString()}.${fraction}` : whole.toString()
  return negative ? `-${body}` : body
}
