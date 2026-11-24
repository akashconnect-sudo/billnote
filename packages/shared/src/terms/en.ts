export type UiMode = 'simple' | 'advanced'

export const termsEn = {
  todaySales: { simple: "Today's sales", advanced: 'Sales today' },
  moneyIn: { simple: 'Money received', advanced: 'Receipts' },
  receivable: { simple: 'Money you will get', advanced: 'Accounts receivable' },
  payable: { simple: 'Money you will pay', advanced: 'Accounts payable' },
  lowStock: { simple: 'Items almost finished', advanced: 'Below reorder level' },
  profit: { simple: 'Profit', advanced: 'Gross profit' },
  items: { simple: 'Items', advanced: 'SKUs' },
  customers: { simple: 'Customers', advanced: 'Sundry debtors' },
  suppliers: { simple: 'Suppliers', advanced: 'Sundry creditors' },
  bill: { simple: 'Bill', advanced: 'Tax invoice' },
  quote: { simple: 'Quote', advanced: 'Quotation' },
  udhaar: { simple: 'Udhaar (pay later)', advanced: 'Credit sale' },
  gst: { simple: 'GST', advanced: 'CGST, SGST, and IGST' },
  hsn: { simple: 'Tax code (HSN)', advanced: 'HSN / SAC' },
  stock: { simple: 'Stock', advanced: 'Inventory' },
  cashInHand: { simple: 'Cash in the drawer', advanced: 'Cash book' },
  bank: { simple: 'Bank', advanced: 'Bank book' },
  daybook: { simple: "Today's cash and bills", advanced: 'Day book' },
  profitReport: { simple: 'Profit report', advanced: 'Profit and loss' },
  balanceSheet: { simple: 'What you own and what you owe', advanced: 'Balance sheet' },
  trialBalance: { simple: 'Check of the accounts', advanced: 'Trial balance' },
  staffSales: { simple: 'Sales by staff', advanced: 'Staff-wise sales' },
} as const

export type TermKey = keyof typeof termsEn

export function getTerm(key: TermKey, mode: UiMode = 'simple'): string {
  return termsEn[key][mode]
}
