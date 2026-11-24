'use client'

import { allNavItems, navGroups, type HelpId } from '@billnote/shared'
import { Tip } from '@billnote/ui'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '../../../components/app-shell'
import { NavIcon } from '../../../lib/nav-icons'
import { clearAccessToken } from '../../../lib/session'

export default function MorePage() {
  const router = useRouter()
  const [q, setQ] = useState('')

  const groups = useMemo(() => {
    const query = q.trim().toLowerCase()
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (item.href === '/app') return false
          if (!query) return true
          return (
            item.label.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
          )
        }),
      }))
      .filter((g) => g.items.length > 0)
  }, [q])

  return (
    <AppShell>
      <Tip id="nav.more">
        <h1 className="bn-title">More</h1>
      </Tip>
      <p className="bn-subtitle">Every shop tool in one place.</p>

      <div className="bn-toolbar" style={{ marginTop: 8 }}>
        <input
          className="bn-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search menu…"
          aria-label="Search more menu"
        />
      </div>

      <div className="bn-stack" style={{ marginTop: 8, gap: 20 }}>
        {groups.map((group) => (
          <section key={group.id}>
            <h2 className="bn-section-title">{group.label}</h2>
            <div className="bn-action-grid">
              {group.items.map((item) => (
                <Tip key={item.id} id={item.helpId as HelpId} className="bn-tip-block">
                  <Link href={item.href} className="bn-action">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <NavIcon name={item.icon} />
                      {item.label}
                    </span>
                    <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--bn-ink-soft)' }}>
                      {item.description}
                    </span>
                  </Link>
                </Tip>
              ))}
            </div>
          </section>
        ))}

        {groups.length === 0 ? (
          <p className="bn-field-hint">No matches for “{q}”. Try {allNavItems().length} menu items.</p>
        ) : null}

        <button
          type="button"
          className="bn-btn bn-btn-secondary bn-btn-block"
          onClick={() => {
            clearAccessToken()
            router.push('/login')
          }}
        >
          Log out
        </button>
      </div>
    </AppShell>
  )
}
