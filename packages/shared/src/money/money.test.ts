import { describe, expect, it } from 'vitest'
import {
  divRoundHalfAway,
  formatPaise,
  milli,
  milliToDisplay,
  paise,
  parseRupeesToPaise,
} from './core.js'

describe('divRoundHalfAway', () => {
  it('rounds half away from zero', () => {
    expect(divRoundHalfAway(181n, 2n)).toBe(91n)
    expect(divRoundHalfAway(-181n, 2n)).toBe(-91n)
    expect(divRoundHalfAway(1809000n, 10000n)).toBe(181n)
    expect(divRoundHalfAway(11800n * 10000n, 11800n)).toBe(10000n)
  })

  it('rejects division by zero', () => {
    expect(() => divRoundHalfAway(1n, 0n)).toThrow(/zero/i)
  })
})

describe('formatPaise', () => {
  it('formats Indian grouping with the rupee sign', () => {
    expect(formatPaise(paise(11800))).toBe('₹118.00')
    expect(formatPaise(paise(12345678))).toBe('₹1,23,456.78')
    expect(formatPaise(paise(-500))).toBe('-₹5.00')
  })
})

describe('parseRupeesToPaise', () => {
  it('parses rupees into paise', () => {
    expect(parseRupeesToPaise('118')).toBe(11800n)
    expect(parseRupeesToPaise('₹1,234.50')).toBe(123450n)
    expect(parseRupeesToPaise('-10.5')).toBe(-1050n)
  })

  it('rejects bad input', () => {
    expect(() => parseRupeesToPaise('abc')).toThrow(/amount/i)
  })
})

describe('milliToDisplay', () => {
  it('shows milli quantities as decimals', () => {
    expect(milliToDisplay(milli(1500))).toBe('1.500')
    expect(milliToDisplay(milli(1000), 0)).toBe('1')
  })
})
