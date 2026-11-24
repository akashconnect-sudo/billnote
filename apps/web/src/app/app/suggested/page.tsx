'use client'

import { Tip } from '@billnote/ui'
import { AppShell } from '../../../components/app-shell'
import { IconExternal } from '../../../components/icons'

export default function SuggestedSoftwarePage() {
  return (
    <AppShell>
      <Tip id="nav.suggestCrm">
        <h1 className="bn-title">Suggested Software</h1>
      </Tip>
      <p className="bn-subtitle">Tools that pair well with BILLNOTE for your shop.</p>

      <div className="bn-stack" style={{ marginTop: 16 }}>
        <a
          href="https://salesleadcrm.duckdns.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="bn-action"
          style={{ minHeight: 96, textDecoration: 'none' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            SalesLead CRM
            <IconExternal />
          </span>
          <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--bn-ink-soft)' }}>
            Track leads, follow-ups, and sales pipeline alongside your billing.
          </span>
        </a>
      </div>
    </AppShell>
  )
}
