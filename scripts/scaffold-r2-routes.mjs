import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('apps/web/src/app/app')
const hrefs = [
  '/app/closing',
  '/app/bill/scan',
  '/app/quotations',
  '/app/sales-orders',
  '/app/delivery-challans',
  '/app/credit-notes',
  '/app/recurring-invoices',
  '/app/purchase-orders',
  '/app/debit-notes',
  '/app/payments-made',
  '/app/categories',
  '/app/labels',
  '/app/stock/adjust',
  '/app/stock/transfer',
  '/app/batches',
  '/app/stock/low',
  '/app/stock/count',
  '/app/udhaar',
  '/app/staff',
  '/app/loyalty',
  '/app/appointments',
  '/app/cash-bank',
  '/app/cheques',
  '/app/loans',
  '/app/daybook',
  '/app/ledger',
  '/app/gst',
  '/app/reports/sales',
  '/app/reports/purchase',
  '/app/reports/profit-loss',
  '/app/reports/gst',
  '/app/reports/stock',
  '/app/reports/parties',
  '/app/reports/aging',
  '/app/reports/staff',
  '/app/reports/expenses',
  '/app/modules/tables',
  '/app/modules/kitchen',
  '/app/modules/job-cards',
  '/app/modules/memberships',
  '/app/modules/fees',
  '/app/modules/rent',
  '/app/modules/trips',
  '/app/modules/visits',
  '/app/modules/weighing',
  '/app/grow/campaigns',
  '/app/grow/offers',
  '/app/grow/catalog',
  '/app/grow/reviews',
  '/app/settings/profile',
  '/app/settings/templates',
  '/app/settings/taxes',
  '/app/settings/users',
  '/app/settings/backups',
  '/app/settings/integrations',
  '/app/settings/subscription',
  '/app/help',
]

let created = 0
for (const href of hrefs) {
  const rel = href.replace(/^\/app\//, '')
  const dir = path.join(root, rel)
  const file = path.join(dir, 'page.tsx')
  if (fs.existsSync(file)) {
    console.log('skip', href)
    continue
  }
  fs.mkdirSync(dir, { recursive: true })
  const depth = rel.split('/').length
  const up = '../'.repeat(depth + 2)
  const content = `'use client'

import { ModuleScreen } from '${up}components/module-screen'

export default function Page() {
  return <ModuleScreen href="${href}" />
}
`
  fs.writeFileSync(file, content)
  created += 1
  console.log('create', href)
}
console.log('created', created)
