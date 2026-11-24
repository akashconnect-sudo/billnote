'use client'

import { Tip } from '@billnote/ui'
import Link from 'next/link'
import { AppShell } from '../../../components/app-shell'
import { NavIcon } from '../../../lib/nav-icons'

const links = [
  { href: '/app/stock/low', label: 'Low Stock', icon: 'lowStock' as const, tip: 'nav.lowStock' as const },
  { href: '/app/stock/adjust', label: 'Stock Adjustment', icon: 'adjust' as const, tip: 'nav.stockAdjust' as const },
  { href: '/app/stock/transfer', label: 'Stock Transfer', icon: 'transfer' as const, tip: 'nav.stockTransfer' as const },
  { href: '/app/stock/count', label: 'Stock Count', icon: 'count' as const, tip: 'nav.stockCount' as const },
  { href: '/app/batches', label: 'Batches & Expiry', icon: 'batch' as const, tip: 'nav.batches' as const },
  { href: '/app/items', label: 'Items & Services', icon: 'items' as const, tip: 'nav.items' as const },
]

export default function StockPage() {
  return (
    <AppShell>
      <Tip id="nav.stock">
        <h1 className="bn-title">Stock</h1>
      </Tip>
      <p className="bn-subtitle">Quantities, low stock, and adjustments.</p>
      <div className="bn-action-grid" style={{ marginTop: 16 }}>
        {links.map((item) => (
          <Tip key={item.href} id={item.tip} className="bn-tip-block">
            <Link href={item.href} className="bn-action">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <NavIcon name={item.icon} />
                {item.label}
              </span>
            </Link>
          </Tip>
        ))}
      </div>
    </AppShell>
  )
}
