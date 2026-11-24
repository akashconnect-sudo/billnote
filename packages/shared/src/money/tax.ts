import { divRoundHalfAway, paise, type Milli, type Paise } from './core.js'

export type SupplyType = 'intra' | 'inter'
export type PriceMode = 'inclusive' | 'exclusive'
export type RoundOffMode = 'none' | 'nearest_rupee'

export type LineTaxInput = {
  qtyMilli: Milli
  unitPricePaise: Paise
  discountPaise?: Paise
  gstBps: number
  cessBps?: number
  priceMode: PriceMode
  supplyType: SupplyType
}

export type LineTaxResult = {
  grossPaise: Paise
  discountPaise: Paise
  taxablePaise: Paise
  gstPaise: Paise
  cgstPaise: Paise
  sgstPaise: Paise
  igstPaise: Paise
  cessPaise: Paise
  lineTotalPaise: Paise
}

export type DocumentTotals = {
  subtotalPaise: Paise
  discountPaise: Paise
  taxablePaise: Paise
  cgstPaise: Paise
  sgstPaise: Paise
  igstPaise: Paise
  cessPaise: Paise
  roundOffPaise: Paise
  grandTotalPaise: Paise
}

/** Line amount before tax split: qty × price ÷ 1000, half away from zero. */
export function lineGrossPaise(qtyMilli: Milli, unitPricePaise: Paise): Paise {
  return paise(divRoundHalfAway(qtyMilli * unitPricePaise, 1000n))
}

export function computeLineTax(input: LineTaxInput): LineTaxResult {
  const discount = paise(input.discountPaise ?? 0n)
  const gstBps = BigInt(input.gstBps)
  const cessBps = BigInt(input.cessBps ?? 0)
  const grossBeforeDiscount = lineGrossPaise(input.qtyMilli, input.unitPricePaise)
  const gross = paise(grossBeforeDiscount - discount)

  let taxable: bigint
  let gst: bigint
  let cess: bigint

  if (input.priceMode === 'exclusive') {
    taxable = gross
    gst = divRoundHalfAway(taxable * gstBps, 10000n)
    cess = divRoundHalfAway(taxable * cessBps, 10000n)
  } else {
    const denom = 10000n + gstBps + cessBps
    if (denom === 10000n) {
      taxable = gross
      gst = 0n
      cess = 0n
    } else {
      taxable = divRoundHalfAway(gross * 10000n, denom)
      const taxPool = gross - taxable
      if (gstBps + cessBps === 0n) {
        gst = 0n
        cess = 0n
      } else if (cessBps === 0n) {
        gst = taxPool
        cess = 0n
      } else {
        gst = divRoundHalfAway(taxPool * gstBps, gstBps + cessBps)
        cess = taxPool - gst
      }
    }
  }

  let cgst = 0n
  let sgst = 0n
  let igst = 0n
  if (input.supplyType === 'inter') {
    igst = gst
  } else {
    cgst = divRoundHalfAway(gst, 2n)
    sgst = gst - cgst
  }

  const lineTotal =
    input.priceMode === 'inclusive' ? gross : taxable + gst + cess

  return {
    grossPaise: paise(grossBeforeDiscount),
    discountPaise: discount,
    taxablePaise: paise(taxable),
    gstPaise: paise(gst),
    cgstPaise: paise(cgst),
    sgstPaise: paise(sgst),
    igstPaise: paise(igst),
    cessPaise: paise(cess),
    lineTotalPaise: paise(lineTotal),
  }
}

export function sumDocumentTotals(
  lines: LineTaxResult[],
  roundOffMode: RoundOffMode = 'nearest_rupee',
): DocumentTotals {
  let subtotal = 0n
  let discount = 0n
  let taxable = 0n
  let cgst = 0n
  let sgst = 0n
  let igst = 0n
  let cess = 0n
  let total = 0n

  for (const line of lines) {
    subtotal += line.grossPaise
    discount += line.discountPaise
    taxable += line.taxablePaise
    cgst += line.cgstPaise
    sgst += line.sgstPaise
    igst += line.igstPaise
    cess += line.cessPaise
    total += line.lineTotalPaise
  }

  let roundOff = 0n
  let grand = total
  if (roundOffMode === 'nearest_rupee') {
    const target = divRoundHalfAway(total, 100n) * 100n
    roundOff = target - total
    grand = target
  }

  return {
    subtotalPaise: paise(subtotal),
    discountPaise: paise(discount),
    taxablePaise: paise(taxable),
    cgstPaise: paise(cgst),
    sgstPaise: paise(sgst),
    igstPaise: paise(igst),
    cessPaise: paise(cess),
    roundOffPaise: paise(roundOff),
    grandTotalPaise: paise(grand),
  }
}
