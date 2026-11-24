import { describe, expect, it } from 'vitest'
import { milli, paise } from './core.js'
import { computeLineTax, sumDocumentTotals } from './tax.js'

describe('computeLineTax', () => {
  it('splits inclusive ₹118 at 18% intra-state', () => {
    const line = computeLineTax({
      qtyMilli: milli(1000),
      unitPricePaise: paise(11800),
      gstBps: 1800,
      priceMode: 'inclusive',
      supplyType: 'intra',
    })
    expect(line.taxablePaise).toBe(10000n)
    expect(line.gstPaise).toBe(1800n)
    expect(line.cgstPaise).toBe(900n)
    expect(line.sgstPaise).toBe(900n)
    expect(line.lineTotalPaise).toBe(11800n)
  })

  it('adds exclusive ₹100 + 18% inter-state', () => {
    const line = computeLineTax({
      qtyMilli: milli(1000),
      unitPricePaise: paise(10000),
      gstBps: 1800,
      priceMode: 'exclusive',
      supplyType: 'inter',
    })
    expect(line.taxablePaise).toBe(10000n)
    expect(line.igstPaise).toBe(1800n)
    expect(line.cgstPaise).toBe(0n)
    expect(line.lineTotalPaise).toBe(11800n)
  })

  it('applies exclusive line discount then tax', () => {
    const line = computeLineTax({
      qtyMilli: milli(1000),
      unitPricePaise: paise(10000),
      discountPaise: paise(1000),
      gstBps: 1800,
      priceMode: 'exclusive',
      supplyType: 'intra',
    })
    expect(line.taxablePaise).toBe(9000n)
    expect(line.gstPaise).toBe(1620n)
    expect(line.cgstPaise).toBe(810n)
    expect(line.sgstPaise).toBe(810n)
    expect(line.lineTotalPaise).toBe(10620n)
  })

  it('gives odd paise to CGST', () => {
    const line = computeLineTax({
      qtyMilli: milli(1000),
      unitPricePaise: paise(1005),
      gstBps: 1800,
      priceMode: 'exclusive',
      supplyType: 'intra',
    })
    expect(line.gstPaise).toBe(181n)
    expect(line.cgstPaise).toBe(91n)
    expect(line.sgstPaise).toBe(90n)
  })
})

describe('sumDocumentTotals', () => {
  it('rounds to nearest rupee', () => {
    const line = computeLineTax({
      qtyMilli: milli(1000),
      unitPricePaise: paise(1005),
      gstBps: 1800,
      priceMode: 'exclusive',
      supplyType: 'intra',
    })
    const totals = sumDocumentTotals([line], 'nearest_rupee')
    expect(totals.grandTotalPaise % 100n).toBe(0n)
    expect(totals.roundOffPaise).toBe(totals.grandTotalPaise - line.lineTotalPaise)
  })
})
