'use client'

import { Tip } from '@billnote/ui'
import type { HelpId } from '@billnote/shared'
import Link from 'next/link'
import { AppShell } from './app-shell'

export function ComingSoonPage({
  title,
  helpId,
  body,
  businessName,
}: {
  title: string
  helpId: HelpId
  body: string
  businessName?: string
}) {
  return (
    <AppShell businessName={businessName}>
      <Tip id={helpId}>
        <h1 className="bn-title">{title}</h1>
      </Tip>
      <p className="bn-subtitle">{body}</p>
      <div className="bn-empty">
        <p style={{ margin: '0 0 8px', fontWeight: 650 }}>Coming in the next steps</p>
        <p style={{ margin: '0 0 16px', color: 'var(--bn-ink-soft)', fontSize: 14 }}>
          You can keep billing and adding items meanwhile.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/app/bill" className="bn-btn bn-btn-primary">
            New bill
          </Link>
          <Link href="/app/items" className="bn-btn bn-btn-secondary">
            Items
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
