'use client'

import { allNavItems, quickCreates, type HelpId } from '@billnote/shared'
import { Input, Tip } from '@billnote/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { NavIcon } from '../lib/nav-icons'

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!open) setQ('')
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (open) onClose()
        else document.dispatchEvent(new CustomEvent('bn:open-command'))
      }
      if (event.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    const pages = allNavItems().filter((item) => {
      if (!query) return true
      return (
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    })
    const creates = quickCreates.filter((item) => {
      if (!query) return true
      return item.label.toLowerCase().includes(query)
    })
    return { pages: pages.slice(0, 12), creates: creates.slice(0, 8) }
  }, [q])

  if (!open) return null

  return (
    <div className="bn-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="bn-modal bn-command"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <Tip id={'shell.commandPalette' as HelpId} className="bn-tip-block">
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What do you want to do?"
            aria-label="Command search"
          />
        </Tip>

        <div className="bn-command-section">
          <div className="bn-nav-label">Create</div>
          {results.creates.map((item) => (
            <button
              key={item.id}
              type="button"
              className="bn-command-row"
              onClick={() => {
                onClose()
                router.push(item.href)
              }}
            >
              <span>{item.label}</span>
              {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
            </button>
          ))}
        </div>

        <div className="bn-command-section">
          <div className="bn-nav-label">Go to</div>
          {results.pages.map((item) => (
            <button
              key={item.id}
              type="button"
              className="bn-command-row"
              onClick={() => {
                onClose()
                router.push(item.href)
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <NavIcon name={item.icon} size={18} />
                {item.label}
              </span>
              <span className="bn-command-meta">{item.description}</span>
            </button>
          ))}
          {results.pages.length === 0 ? (
            <p className="bn-field-hint">No matching pages.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
