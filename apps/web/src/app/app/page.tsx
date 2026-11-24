'use client'

import { formatPaise, getTerm, paise } from '@billnote/shared'
import { Tip } from '@billnote/ui'
import Link from 'next/link'
import { startTransition, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '../../components/app-shell'
import { IconPlus, IconScan, IconPeople, IconBill } from '../../components/icons'
import { InstallBanner } from '../../components/install-banner'
import { api } from '../../lib/api'
import { getAccessToken, setAccessToken } from '../../lib/session'

type MeResponse = {
  user: { fullName: string }
  businesses: Array<{
    businessId: string
    displayName: string
    status: string
    isDefault: boolean
  }>
}

type Dashboard = {
  todaySalesPaise: string
  moneyInPaise: string
  receivablePaise: string
  lowStockCount: number
  billCountToday: number
}

export default function AppHomePage() {
  const router = useRouter()
  const [me, setMe] = useState<MeResponse | null>(null)
  const [dash, setDash] = useState<Dashboard | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      router.replace('/login')
      return
    }
    void api<MeResponse>('/api/v1/me', { token }).then((result) => {
      if (result.error || !result.data) {
        router.replace('/login')
        return
      }
      startTransition(() => setMe(result.data))
    })
    void api<Dashboard>('/api/v1/dashboard/today', { token }).then((result) => {
      if (result.data) startTransition(() => setDash(result.data))
    })
  }, [router])

  const current =
    me?.businesses.find((b) => b.isDefault) ?? me?.businesses[0] ?? null

  const stats = [
    {
      helpId: 'dashboard.todaySales' as const,
      term: 'todaySales' as const,
      tone: 'bn-stat-good',
      value: formatPaise(paise(dash?.todaySalesPaise ?? 0)),
    },
    {
      helpId: 'dashboard.moneyIn' as const,
      term: 'moneyIn' as const,
      tone: 'bn-stat-good',
      value: formatPaise(paise(dash?.moneyInPaise ?? 0)),
    },
    {
      helpId: 'dashboard.receivable' as const,
      term: 'receivable' as const,
      tone: 'bn-stat-attention',
      value: formatPaise(paise(dash?.receivablePaise ?? 0)),
    },
    {
      helpId: 'dashboard.lowStock' as const,
      term: 'lowStock' as const,
      tone: 'bn-stat-urgent',
      value: String(dash?.lowStockCount ?? 0),
    },
  ]

  return (
    <AppShell businessName={current?.displayName}>
      <InstallBanner />

      <Tip id="scaffold.welcome" className="bn-tip-block">
        <p style={{ marginTop: 0, marginBottom: 18, fontSize: '1.05rem' }}>
          Hello{me ? `, ${me.user.fullName}` : ''}. Here is today at a glance.
        </p>
      </Tip>

      {current && current.status !== 'ready' ? (
        <p className="bn-alert bn-alert-info" style={{ marginBottom: 16 }}>
          Shop status: {current.status}. We are finishing setup in the background.
        </p>
      ) : null}

      <div className="bn-stat-grid">
        {stats.map((stat) => (
          <Tip key={stat.helpId} id={stat.helpId} showInfoIcon className="bn-tip-block">
            <article className="bn-stat" data-widget={stat.helpId}>
              <div className="bn-stat-label">{getTerm(stat.term, 'simple')}</div>
              <div className={`bn-stat-value ${stat.tone}`}>{stat.value}</div>
            </article>
          </Tip>
        ))}
      </div>

      <section style={{ marginTop: 28 }}>
        <h2 className="bn-section-title">Quick actions</h2>
        <div className="bn-action-grid">
          <Tip id="action.newBill" className="bn-tip-block">
            <Link href="/app/bill" className="bn-action">
              <IconBill />
              New bill
            </Link>
          </Tip>
          <Tip id="action.scanSell" className="bn-tip-block">
            <Link href="/app/bill" className="bn-action">
              <IconScan />
              Scan to sell
            </Link>
          </Tip>
          <Tip id="action.addItem" className="bn-tip-block">
            <Link href="/app/items" className="bn-action">
              <IconPlus />
              Add item
            </Link>
          </Tip>
          <Tip id="action.addCustomer" className="bn-tip-block">
            <Link href="/app/customers" className="bn-action">
              <IconPeople />
              Add customer
            </Link>
          </Tip>
        </div>
      </section>

      {me && me.businesses.length > 1 ? (
        <section style={{ marginTop: 28 }}>
          <Tip id="nav.switchBusiness">
            <h2 className="bn-section-title">Your shops</h2>
          </Tip>
          <div className="bn-stack">
            {me.businesses.map((business) => (
              <button
                key={business.businessId}
                type="button"
                className="bn-btn bn-btn-secondary"
                style={{
                  justifyContent: 'flex-start',
                  background: business.isDefault ? 'var(--bn-brand-soft)' : undefined,
                  borderColor: business.isDefault ? 'var(--bn-brand)' : undefined,
                }}
                disabled={busy || business.isDefault}
                onClick={async () => {
                  const token = getAccessToken()
                  if (!token) return
                  setBusy(true)
                  const result = await api<{ accessToken: string }>(
                    `/api/v1/me/businesses/${business.businessId}/switch`,
                    { method: 'POST', token },
                  )
                  setBusy(false)
                  if (result.data?.accessToken) {
                    setAccessToken(result.data.accessToken)
                    window.location.reload()
                  }
                }}
              >
                {business.displayName}
                {business.isDefault ? ' · current' : ''}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  )
}
