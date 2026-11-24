'use client'

import { findNavItem, type HelpId } from '@billnote/shared'
import { Button, EmptyState, Input, Skeleton, Table, TBody, TD, TH, THead, Tip, TR } from '@billnote/ui'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AppShell } from './app-shell'
import { NavIcon } from '../lib/nav-icons'

export function ModuleScreen({
  href,
  businessName,
}: {
  href: string
  businessName?: string
}) {
  const item = findNavItem(href)
  const [q, setQ] = useState('')
  const [loading] = useState(false)

  const title = item?.label ?? 'Module'
  const helpId = (item?.helpId ?? 'nav.more') as HelpId
  const body = item?.description ?? 'This screen is ready for data in a later phase.'

  const rows = useMemo(() => {
    if (!q.trim()) return [] as string[]
    return []
  }, [q])

  return (
    <AppShell businessName={businessName}>
      <div className="bn-page-header">
        <div>
          <Tip id={helpId}>
            <h1 className="bn-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {item ? <NavIcon name={item.icon} /> : null}
              {title}
            </h1>
          </Tip>
          <p className="bn-subtitle" style={{ marginBottom: 0 }}>
            {body}
          </p>
        </div>
        <div className="bn-page-actions">
          <Button variant="secondary" type="button" disabled>
            Export
          </Button>
          <Button type="button" disabled title="Create opens when this module’s API ships">
            Create
          </Button>
        </div>
      </div>

      <div className="bn-toolbar" style={{ marginTop: 16 }}>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}…`}
          aria-label={`Search ${title}`}
        />
        <Button variant="secondary" type="button">
          Filters
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          <Skeleton height={48} />
          <Skeleton height={48} />
          <Skeleton height={48} />
        </div>
      ) : rows.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <EmptyState
            title={`No ${title.toLowerCase()} yet`}
            body="This page is live in the menu. Data and create forms connect as each module’s API arrives — without breaking billing."
            action={
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/app/bill" className="bn-btn bn-btn-primary">
                  New bill
                </Link>
                <Link href="/app/items" className="bn-btn bn-btn-secondary">
                  Items
                </Link>
              </div>
            }
          />
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Status</TH>
                <TH>Updated</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((row) => (
                <TR key={row}>
                  <TD>{row}</TD>
                  <TD>—</TD>
                  <TD>—</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      )}
    </AppShell>
  )
}
