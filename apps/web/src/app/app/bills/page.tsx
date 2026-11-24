'use client'

import { formatPaise, paise } from '@billnote/shared'
import { Tip } from '@billnote/ui'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '../../../components/app-shell'
import { api } from '../../../lib/api'
import { getAccessToken } from '../../../lib/session'

type BillRow = {
  id: string
  displayNumber: string | null
  status: string
  grandTotalPaise: string
  amountPaidPaise: string
  balancePaise: string
  issuedOn: string | null
  confirmedAt: string | null
}

type Dashboard = {
  todaySalesPaise: string
  moneyInPaise: string
  receivablePaise: string
  billCountToday: number
  recentBills: BillRow[]
}

export default function BillsPage() {
  const router = useRouter()
  const [rows, setRows] = useState<BillRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      router.replace('/login')
      return
    }
    void api<Dashboard>('/api/v1/dashboard/today', { token }).then((result) => {
      if (result.error || !result.data) {
        setError(result.error?.message ?? 'Could not load bills.')
        return
      }
      setRows(result.data.recentBills)
    })
  }, [router])

  return (
    <AppShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
        <div>
          <Tip id="nav.bills">
            <h1 className="bn-title">All bills</h1>
          </Tip>
          <p className="bn-subtitle" style={{ marginBottom: 0 }}>
            Recent sales from this shop.
          </p>
        </div>
        <Link href="/app/bill" className="bn-btn bn-btn-primary">
          New bill
        </Link>
      </div>

      {error ? <p className="bn-alert bn-alert-error" style={{ marginTop: 14 }}>{error}</p> : null}

      {rows.length === 0 && !error ? (
        <div className="bn-empty" style={{ marginTop: 18 }}>
          <p style={{ margin: '0 0 8px', fontWeight: 650 }}>No bills yet</p>
          <p style={{ margin: '0 0 14px', color: 'var(--bn-ink-soft)', fontSize: 14 }}>
            Make your first sale from the Bill screen.
          </p>
          <Link href="/app/bill" className="bn-btn bn-btn-primary">
            Open bill
          </Link>
        </div>
      ) : (
        <div className="bn-list" style={{ marginTop: 18 }}>
          {rows.map((bill) => (
            <article key={bill.id} className="bn-list-row">
              <div>
                <strong>{bill.displayNumber ?? 'Draft / held'}</strong>
                <div className="bn-list-meta">
                  {bill.status}
                  {bill.issuedOn ? ` · ${bill.issuedOn}` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700 }}>{formatPaise(paise(bill.grandTotalPaise))}</div>
                {bill.balancePaise !== '0' ? (
                  <div className="bn-list-meta">Due {formatPaise(paise(bill.balancePaise))}</div>
                ) : (
                  <div className="bn-list-meta">Paid</div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  )
}
