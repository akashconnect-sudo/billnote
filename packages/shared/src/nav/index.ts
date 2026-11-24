import type { PermissionKey } from '../permissions.js'

export type NavIconKey =
  | 'home'
  | 'bill'
  | 'scan'
  | 'invoices'
  | 'quote'
  | 'order'
  | 'challan'
  | 'return'
  | 'recurring'
  | 'payment'
  | 'purchase'
  | 'expense'
  | 'items'
  | 'category'
  | 'label'
  | 'adjust'
  | 'transfer'
  | 'batch'
  | 'lowStock'
  | 'count'
  | 'customers'
  | 'suppliers'
  | 'udhaar'
  | 'staff'
  | 'loyalty'
  | 'appointment'
  | 'bank'
  | 'cheque'
  | 'loan'
  | 'daybook'
  | 'ledger'
  | 'gst'
  | 'report'
  | 'tables'
  | 'kot'
  | 'job'
  | 'membership'
  | 'fees'
  | 'rent'
  | 'trip'
  | 'visit'
  | 'scale'
  | 'campaign'
  | 'offer'
  | 'store'
  | 'review'
  | 'sparkle'
  | 'settings'
  | 'help'
  | 'closing'

export type NavItemDef = {
  id: string
  href: string
  label: string
  helpId: string
  icon: NavIconKey
  permission?: PermissionKey
  /** Hide unless business category matches (empty = always). */
  categories?: string[]
  badgeKey?: 'overdue' | 'lowStock' | 'pendingSync'
  description: string
  /** If true, page already has custom implementation. */
  implemented?: boolean
}

export type NavGroupDef = {
  id: string
  label: string
  items: NavItemDef[]
}

export const navGroups: NavGroupDef[] = [
  {
    id: 'home',
    label: 'Home',
    items: [
      {
        id: 'dashboard',
        href: '/app',
        label: 'Dashboard',
        helpId: 'nav.home',
        icon: 'home',
        description: 'Today’s money and smart suggestions.',
        implemented: true,
      },
      {
        id: 'closing',
        href: '/app/closing',
        label: 'Daily Closing',
        helpId: 'nav.closing',
        icon: 'closing',
        description: 'Count cash and close the day.',
      },
    ],
  },
  {
    id: 'sell',
    label: 'Sell',
    items: [
      {
        id: 'bill',
        href: '/app/bill',
        label: 'New Bill',
        helpId: 'nav.bill',
        icon: 'bill',
        permission: 'invoice.create',
        description: 'Open the cashier screen to sell.',
        implemented: true,
      },
      {
        id: 'scan-sell',
        href: '/app/bill/scan',
        label: 'Scan to Sell',
        helpId: 'nav.scanSell',
        icon: 'scan',
        permission: 'invoice.create',
        description: 'Scan barcodes straight into a bill.',
      },
      {
        id: 'invoices',
        href: '/app/bills',
        label: 'Invoices',
        helpId: 'nav.bills',
        icon: 'invoices',
        permission: 'invoice.read',
        badgeKey: 'overdue',
        description: 'All tax invoices and bills.',
        implemented: true,
      },
      {
        id: 'quotations',
        href: '/app/quotations',
        label: 'Quotations',
        helpId: 'nav.quotations',
        icon: 'quote',
        permission: 'quote.create',
        description: 'Estimates you can convert to bills.',
      },
      {
        id: 'sales-orders',
        href: '/app/sales-orders',
        label: 'Sales Orders',
        helpId: 'nav.salesOrders',
        icon: 'order',
        permission: 'invoice.read',
        description: 'Confirmed orders before delivery.',
      },
      {
        id: 'delivery-challans',
        href: '/app/delivery-challans',
        label: 'Delivery Challans',
        helpId: 'nav.deliveryChallans',
        icon: 'challan',
        permission: 'invoice.read',
        description: 'Delivery notes for goods sent.',
      },
      {
        id: 'credit-notes',
        href: '/app/credit-notes',
        label: 'Sales Returns',
        helpId: 'nav.creditNotes',
        icon: 'return',
        permission: 'invoice.read',
        description: 'Credit notes and returned sales.',
      },
      {
        id: 'recurring',
        href: '/app/recurring-invoices',
        label: 'Recurring Invoices',
        helpId: 'nav.recurring',
        icon: 'recurring',
        permission: 'invoice.create',
        description: 'Bills that repeat on a schedule.',
      },
      {
        id: 'payments-received',
        href: '/app/payments',
        label: 'Payments Received',
        helpId: 'nav.payments',
        icon: 'payment',
        permission: 'payment.read',
        description: 'Cash, UPI, and card receipts.',
        implemented: true,
      },
    ],
  },
  {
    id: 'buy',
    label: 'Buy',
    items: [
      {
        id: 'purchase-bills',
        href: '/app/purchases',
        label: 'Purchase Bills',
        helpId: 'nav.purchases',
        icon: 'purchase',
        permission: 'purchase.read',
        description: 'Bills from your suppliers.',
        implemented: true,
      },
      {
        id: 'purchase-orders',
        href: '/app/purchase-orders',
        label: 'Purchase Orders',
        helpId: 'nav.purchaseOrders',
        icon: 'order',
        permission: 'purchase.create',
        description: 'Orders you place with suppliers.',
      },
      {
        id: 'debit-notes',
        href: '/app/debit-notes',
        label: 'Purchase Returns',
        helpId: 'nav.debitNotes',
        icon: 'return',
        permission: 'purchase.read',
        description: 'Debit notes for goods returned.',
      },
      {
        id: 'payments-made',
        href: '/app/payments-made',
        label: 'Payments Made',
        helpId: 'nav.paymentsMade',
        icon: 'payment',
        permission: 'payment.read',
        description: 'Money you paid to suppliers.',
      },
      {
        id: 'expenses',
        href: '/app/expenses',
        label: 'Expenses',
        helpId: 'nav.expenses',
        icon: 'expense',
        permission: 'expense.read',
        description: 'Rent, salary, and shop costs.',
        implemented: true,
      },
    ],
  },
  {
    id: 'stock',
    label: 'Stock',
    items: [
      {
        id: 'items',
        href: '/app/items',
        label: 'Items & Services',
        helpId: 'nav.items',
        icon: 'items',
        permission: 'product.read',
        description: 'Products and services you sell.',
        implemented: true,
      },
      {
        id: 'categories',
        href: '/app/categories',
        label: 'Categories & Brands',
        helpId: 'nav.categories',
        icon: 'category',
        permission: 'product.read',
        description: 'Group items for faster finding.',
      },
      {
        id: 'labels',
        href: '/app/labels',
        label: 'Barcode Labels',
        helpId: 'nav.labels',
        icon: 'label',
        permission: 'product.read',
        description: 'Print barcode stickers.',
      },
      {
        id: 'stock-adjust',
        href: '/app/stock/adjust',
        label: 'Stock Adjustment',
        helpId: 'nav.stockAdjust',
        icon: 'adjust',
        permission: 'stock.adjust',
        description: 'Fix quantities after a count.',
      },
      {
        id: 'stock-transfer',
        href: '/app/stock/transfer',
        label: 'Stock Transfer',
        helpId: 'nav.stockTransfer',
        icon: 'transfer',
        permission: 'stock.transfer',
        description: 'Move stock between branches.',
      },
      {
        id: 'batches',
        href: '/app/batches',
        label: 'Batches & Expiry',
        helpId: 'nav.batches',
        icon: 'batch',
        permission: 'product.read',
        description: 'Track batch numbers and expiry.',
      },
      {
        id: 'low-stock',
        href: '/app/stock/low',
        label: 'Low Stock',
        helpId: 'nav.lowStock',
        icon: 'lowStock',
        permission: 'product.read',
        badgeKey: 'lowStock',
        description: 'Items that need reordering soon.',
      },
      {
        id: 'stock-count',
        href: '/app/stock/count',
        label: 'Stock Count',
        helpId: 'nav.stockCount',
        icon: 'count',
        permission: 'stock.count',
        description: 'Scan and count what is on the shelf.',
      },
    ],
  },
  {
    id: 'people',
    label: 'People',
    items: [
      {
        id: 'customers',
        href: '/app/customers',
        label: 'Customers',
        helpId: 'nav.customers',
        icon: 'customers',
        permission: 'party.read',
        description: 'Buyers, phone numbers, and udhaar.',
        implemented: true,
      },
      {
        id: 'suppliers',
        href: '/app/suppliers',
        label: 'Suppliers',
        helpId: 'nav.suppliers',
        icon: 'suppliers',
        permission: 'party.read',
        description: 'People you buy stock from.',
        implemented: true,
      },
      {
        id: 'udhaar',
        href: '/app/udhaar',
        label: 'Udhaar / Credit',
        helpId: 'nav.udhaar',
        icon: 'udhaar',
        permission: 'party.read',
        description: 'Who owes you and what you owe.',
      },
      {
        id: 'staff',
        href: '/app/staff',
        label: 'Staff',
        helpId: 'nav.staff',
        icon: 'staff',
        permission: 'staff.manage',
        description: 'Team members and roles.',
      },
      {
        id: 'loyalty',
        href: '/app/loyalty',
        label: 'Loyalty & Coupons',
        helpId: 'nav.loyalty',
        icon: 'loyalty',
        permission: 'settings.manage',
        description: 'Points and discount coupons.',
      },
      {
        id: 'appointments',
        href: '/app/appointments',
        label: 'Appointments',
        helpId: 'nav.appointments',
        icon: 'appointment',
        categories: ['salon', 'clinic', 'custom'],
        description: 'Bookings for services.',
      },
    ],
  },
  {
    id: 'money',
    label: 'Money',
    items: [
      {
        id: 'cash-bank',
        href: '/app/cash-bank',
        label: 'Cash & Bank',
        helpId: 'nav.cashBank',
        icon: 'bank',
        permission: 'accounting.view',
        description: 'Cash in hand and bank balances.',
      },
      {
        id: 'cheques',
        href: '/app/cheques',
        label: 'Cheques',
        helpId: 'nav.cheques',
        icon: 'cheque',
        permission: 'payment.read',
        description: 'Cheques received and issued.',
      },
      {
        id: 'loans',
        href: '/app/loans',
        label: 'Loans',
        helpId: 'nav.loans',
        icon: 'loan',
        permission: 'accounting.view',
        description: 'Shop loans and EMI tracking.',
      },
      {
        id: 'daybook',
        href: '/app/daybook',
        label: 'Day Book',
        helpId: 'nav.daybook',
        icon: 'daybook',
        permission: 'report.view',
        description: 'Today’s cash and bills together.',
      },
      {
        id: 'ledger',
        href: '/app/ledger',
        label: 'Ledger',
        helpId: 'nav.ledger',
        icon: 'ledger',
        permission: 'accounting.view',
        description: 'Account-wise ledger entries.',
      },
      {
        id: 'gst',
        href: '/app/gst',
        label: 'GST',
        helpId: 'nav.gst',
        icon: 'gst',
        permission: 'report.view',
        description: 'Returns, HSN, e-invoice, e-way.',
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    items: [
      {
        id: 'reports-hub',
        href: '/app/reports',
        label: 'All Reports',
        helpId: 'nav.reports',
        icon: 'report',
        permission: 'report.view',
        description: 'Sales, GST, stock, and more.',
        implemented: true,
      },
      {
        id: 'report-sales',
        href: '/app/reports/sales',
        label: 'Sales',
        helpId: 'nav.reportSales',
        icon: 'report',
        permission: 'report.view',
        description: 'Sales by day, item, or staff.',
      },
      {
        id: 'report-purchase',
        href: '/app/reports/purchase',
        label: 'Purchase',
        helpId: 'nav.reportPurchase',
        icon: 'report',
        permission: 'report.view',
        description: 'What you bought and from whom.',
      },
      {
        id: 'report-pl',
        href: '/app/reports/profit-loss',
        label: 'Profit & Loss',
        helpId: 'nav.reportPl',
        icon: 'report',
        permission: 'report.view',
        description: 'Income minus costs for a period.',
      },
      {
        id: 'report-gst',
        href: '/app/reports/gst',
        label: 'GST Reports',
        helpId: 'nav.reportGst',
        icon: 'gst',
        permission: 'report.view',
        description: 'GSTR summaries and HSN.',
      },
      {
        id: 'report-stock',
        href: '/app/reports/stock',
        label: 'Stock Valuation',
        helpId: 'nav.reportStock',
        icon: 'report',
        permission: 'report.view',
        description: 'Value of stock you hold.',
      },
      {
        id: 'report-party',
        href: '/app/reports/parties',
        label: 'Party Statements',
        helpId: 'nav.reportParty',
        icon: 'report',
        permission: 'report.view',
        description: 'Statements for customers and suppliers.',
      },
      {
        id: 'report-aging',
        href: '/app/reports/aging',
        label: 'Outstanding Aging',
        helpId: 'nav.reportAging',
        icon: 'report',
        permission: 'report.view',
        description: 'How old unpaid bills are.',
      },
      {
        id: 'report-staff',
        href: '/app/reports/staff',
        label: 'Staff Performance',
        helpId: 'nav.reportStaff',
        icon: 'staff',
        permission: 'report.view',
        description: 'Sales by staff member.',
      },
      {
        id: 'report-expense',
        href: '/app/reports/expenses',
        label: 'Expense Report',
        helpId: 'nav.reportExpense',
        icon: 'expense',
        permission: 'report.view',
        description: 'Where shop money was spent.',
      },
    ],
  },
  {
    id: 'modules',
    label: 'Business Modules',
    items: [
      {
        id: 'tables',
        href: '/app/modules/tables',
        label: 'Tables & KOT',
        helpId: 'nav.tables',
        icon: 'tables',
        categories: ['restaurant'],
        description: 'Table map and kitchen tickets.',
      },
      {
        id: 'kot',
        href: '/app/modules/kitchen',
        label: 'Kitchen Display',
        helpId: 'nav.kot',
        icon: 'kot',
        categories: ['restaurant'],
        description: 'Live kitchen order screen.',
      },
      {
        id: 'job-cards',
        href: '/app/modules/job-cards',
        label: 'Job Cards',
        helpId: 'nav.jobCards',
        icon: 'job',
        categories: ['custom', 'salon'],
        description: 'Service jobs and task checklists.',
      },
      {
        id: 'memberships',
        href: '/app/modules/memberships',
        label: 'Memberships',
        helpId: 'nav.memberships',
        icon: 'membership',
        categories: ['salon', 'custom'],
        description: 'Member plans and renewals.',
      },
      {
        id: 'fees',
        href: '/app/modules/fees',
        label: 'Fee Collection',
        helpId: 'nav.fees',
        icon: 'fees',
        categories: ['custom'],
        description: 'Collect school or tuition fees.',
      },
      {
        id: 'rent',
        href: '/app/modules/rent',
        label: 'Rent Cycles',
        helpId: 'nav.rent',
        icon: 'rent',
        categories: ['custom'],
        description: 'Room or property rent cycles.',
      },
      {
        id: 'trips',
        href: '/app/modules/trips',
        label: 'Trips / LR',
        helpId: 'nav.trips',
        icon: 'trip',
        categories: ['custom'],
        description: 'Transport trips and LR notes.',
      },
      {
        id: 'visits',
        href: '/app/modules/visits',
        label: 'Patients / Visits',
        helpId: 'nav.visits',
        icon: 'visit',
        categories: ['pharmacy', 'custom'],
        description: 'Clinic visits and history.',
      },
      {
        id: 'scale',
        href: '/app/modules/weighing',
        label: 'Weighing Scale',
        helpId: 'nav.scale',
        icon: 'scale',
        categories: ['grocery'],
        description: 'Weigh and bill loose items.',
      },
    ],
  },
  {
    id: 'grow',
    label: 'Grow',
    items: [
      {
        id: 'campaigns',
        href: '/app/grow/campaigns',
        label: 'WhatsApp & SMS',
        helpId: 'nav.campaigns',
        icon: 'campaign',
        permission: 'settings.manage',
        description: 'Message campaigns to customers.',
      },
      {
        id: 'offers',
        href: '/app/grow/offers',
        label: 'Offers & Coupons',
        helpId: 'nav.offers',
        icon: 'offer',
        permission: 'settings.manage',
        description: 'Discounts and festive offers.',
      },
      {
        id: 'catalog',
        href: '/app/grow/catalog',
        label: 'Online Catalog',
        helpId: 'nav.catalog',
        icon: 'store',
        permission: 'settings.manage',
        description: 'Share a store link with customers.',
      },
      {
        id: 'reviews',
        href: '/app/grow/reviews',
        label: 'Customer Reviews',
        helpId: 'nav.reviews',
        icon: 'review',
        permission: 'settings.manage',
        description: 'Collect and see customer feedback.',
      },
    ],
  },
  {
    id: 'suggested',
    label: 'Suggested Software',
    items: [
      {
        id: 'suggested',
        href: '/app/suggested',
        label: 'Suggested Software',
        helpId: 'nav.suggestCrm',
        icon: 'sparkle',
        permission: 'settings.manage',
        description: 'Tools that pair well with BILLNOTE.',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [
      {
        id: 'settings-hub',
        href: '/app/settings',
        label: 'Settings',
        helpId: 'nav.settings',
        icon: 'settings',
        permission: 'settings.manage',
        description: 'Shop profile and preferences.',
        implemented: true,
      },
      {
        id: 'settings-profile',
        href: '/app/settings/profile',
        label: 'Business Profile',
        helpId: 'nav.settingsProfile',
        icon: 'settings',
        permission: 'settings.manage',
        description: 'Name, address, logo, and GST.',
      },
      {
        id: 'settings-templates',
        href: '/app/settings/templates',
        label: 'Invoice Templates',
        helpId: 'nav.settingsTemplates',
        icon: 'settings',
        permission: 'template.manage',
        description: 'How your bills look when printed.',
      },
      {
        id: 'settings-tax',
        href: '/app/settings/taxes',
        label: 'Taxes',
        helpId: 'nav.settingsTax',
        icon: 'gst',
        permission: 'settings.tax',
        description: 'Tax rates used on items.',
      },
      {
        id: 'settings-users',
        href: '/app/settings/users',
        label: 'Users & Roles',
        helpId: 'nav.settingsUsers',
        icon: 'staff',
        permission: 'role.manage',
        description: 'Who can log in and what they can do.',
      },
      {
        id: 'settings-privacy',
        href: '/onboarding/permissions',
        label: 'Permissions & Privacy',
        helpId: 'onboarding.permissions',
        icon: 'settings',
        description: 'Camera, location, and other access.',
      },
      {
        id: 'settings-backups',
        href: '/app/settings/backups',
        label: 'Backups',
        helpId: 'nav.settingsBackups',
        icon: 'settings',
        permission: 'settings.manage',
        description: 'Export and restore shop data.',
      },
      {
        id: 'settings-integrations',
        href: '/app/settings/integrations',
        label: 'Integrations',
        helpId: 'nav.settingsIntegrations',
        icon: 'settings',
        permission: 'settings.manage',
        description: 'Connect printers and payment tools.',
      },
      {
        id: 'settings-plan',
        href: '/app/settings/subscription',
        label: 'Subscription',
        helpId: 'nav.settingsPlan',
        icon: 'settings',
        permission: 'settings.manage',
        description: 'Your plan and trial status.',
      },
      {
        id: 'help',
        href: '/app/help',
        label: 'Help & Learn',
        helpId: 'nav.help',
        icon: 'help',
        description: 'Guides, tips, and short videos.',
      },
    ],
  },
]

export function allNavItems(): NavItemDef[] {
  return navGroups.flatMap((g) => g.items)
}

export function findNavItem(href: string): NavItemDef | undefined {
  return allNavItems().find((item) => item.href === href)
}

export const quickCreates: Array<{
  id: string
  href: string
  label: string
  helpId: string
  shortcut?: string
}> = [
  { id: 'qc-bill', href: '/app/bill', label: 'New Bill', helpId: 'action.newBill', shortcut: 'N' },
  { id: 'qc-quote', href: '/app/quotations?new=1', label: 'Quote', helpId: 'nav.quotations' },
  { id: 'qc-purchase', href: '/app/purchases?new=1', label: 'Purchase', helpId: 'nav.purchases' },
  { id: 'qc-expense', href: '/app/expenses?new=1', label: 'Expense', helpId: 'action.addExpense' },
  { id: 'qc-item', href: '/app/items?new=1', label: 'Item', helpId: 'action.addItem' },
  { id: 'qc-customer', href: '/app/customers?new=1', label: 'Customer', helpId: 'action.addCustomer' },
  {
    id: 'qc-receive',
    href: '/app/payments?new=1',
    label: 'Receive Payment',
    helpId: 'action.receivePayment',
  },
  {
    id: 'qc-pay-supplier',
    href: '/app/payments-made?new=1',
    label: 'Pay Supplier',
    helpId: 'nav.paymentsMade',
  },
]
