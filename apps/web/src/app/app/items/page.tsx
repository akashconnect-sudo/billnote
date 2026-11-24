'use client'

import { formatPaise, parseRupeesToPaise, paise } from '@billnote/shared'
import { Tip } from '@billnote/ui'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '../../../components/app-shell'
import { IconPlus, IconScan } from '../../../components/icons'
import { api } from '../../../lib/api'
import { getAccessToken } from '../../../lib/session'

type Product = {
  id: string
  name: string
  sku: string | null
  hsnSac: string | null
  salePricePaise: string
  mrpPaise: string | null
  barcode: string | null
  unitName: string
  unitKey: string
}

type LookupResult = {
  source: 'tenant' | 'open_food_facts' | 'none'
  product: Product | null
  suggestion: {
    name: string | null
    brand: string | null
    barcode: string
  } | null
}

export default function ItemsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Product[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [mrp, setMrp] = useState('')
  const [sku, setSku] = useState('')
  const [hsn, setHsn] = useState('')
  const [barcode, setBarcode] = useState('')
  const [lookupNote, setLookupNote] = useState<string | null>(null)

  const load = useCallback(async (query = '') => {
    const token = getAccessToken()
    if (!token) {
      router.replace('/login')
      return
    }
    setLoading(true)
    setError(null)
    const path = query.trim()
      ? `/api/v1/products?q=${encodeURIComponent(query.trim())}`
      : '/api/v1/products'
    const result = await api<Product[]>(path, { token })
    setLoading(false)
    if (result.error || !result.data) {
      setError(result.error?.message ?? 'Could not load items.')
      return
    }
    setItems(result.data)
  }, [router])

  useEffect(() => {
    void load()
  }, [load])

  function resetForm(prefill?: Partial<{ name: string; barcode: string }>) {
    setName(prefill?.name ?? '')
    setSalePrice('')
    setMrp('')
    setSku('')
    setHsn('')
    setBarcode(prefill?.barcode ?? '')
    setLookupNote(null)
    setError(null)
  }

  async function lookupBarcode() {
    const token = getAccessToken()
    if (!token || !barcode.trim()) return
    setLookupNote('Looking up…')
    const result = await api<LookupResult>('/api/v1/barcodes/lookup', {
      method: 'POST',
      token,
      body: JSON.stringify({ barcode: barcode.trim() }),
    })
    if (result.error || !result.data) {
      setLookupNote(result.error?.message ?? 'Lookup failed.')
      return
    }
    if (result.data.product) {
      setLookupNote(`Already in your shop: ${result.data.product.name}`)
      return
    }
    if (result.data.suggestion?.name) {
      setName(result.data.suggestion.name)
      setLookupNote('Found online. Confirm the name and price, then save.')
      return
    }
    setLookupNote('No match found. Enter the name yourself.')
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
        <div>
          <Tip id="nav.items">
            <h1 className="bn-title">Items</h1>
          </Tip>
          <p className="bn-subtitle" style={{ marginBottom: 0 }}>
            Products and services you sell.
          </p>
        </div>
        <Tip id="action.addItem">
          <button
            type="button"
            className="bn-btn bn-btn-primary"
            onClick={() => {
              resetForm()
              setOpen(true)
            }}
          >
            <IconPlus />
            Add item
          </button>
        </Tip>
      </div>

      <div className="bn-toolbar" style={{ marginTop: 18 }}>
        <Tip id="items.search" className="bn-tip-block">
          <input
            className="bn-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void load(q)
            }}
            placeholder="Search name, SKU, or barcode"
            aria-label="Search items"
          />
        </Tip>
        <button type="button" className="bn-btn bn-btn-secondary" onClick={() => void load(q)}>
          Search
        </button>
      </div>

      {error && !open ? <p className="bn-alert bn-alert-error">{error}</p> : null}

      {loading ? (
        <p className="bn-field-hint">Loading items…</p>
      ) : items.length === 0 ? (
        <Tip id="items.empty" className="bn-tip-block">
          <div className="bn-empty">
            <p style={{ margin: '0 0 8px', fontWeight: 650 }}>No items yet</p>
            <p style={{ margin: '0 0 16px', color: 'var(--bn-ink-soft)', fontSize: 14 }}>
              Add your first product, or look one up by barcode.
            </p>
            <button
              type="button"
              className="bn-btn bn-btn-primary"
              onClick={() => {
                resetForm()
                setOpen(true)
              }}
            >
              <IconPlus />
              Add first item
            </button>
          </div>
        </Tip>
      ) : (
        <div className="bn-list">
          {items.map((item) => (
            <article key={item.id} className="bn-list-row">
              <div>
                <strong>{item.name}</strong>
                <div className="bn-list-meta">
                  {item.barcode ? `Barcode ${item.barcode}` : 'No barcode'}
                  {item.sku ? ` · SKU ${item.sku}` : ''}
                  {` · ${item.unitName}`}
                </div>
              </div>
              <Tip id="field.salePrice">
                <div style={{ fontWeight: 700, color: 'var(--bn-good)', whiteSpace: 'nowrap' }}>
                  {formatPaise(paise(item.salePricePaise))}
                </div>
              </Tip>
            </article>
          ))}
        </div>
      )}

      {open ? (
        <div className="bn-modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="bn-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Add item"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="bn-title" style={{ fontSize: '1.25rem' }}>
              Add item
            </h2>
            <p className="bn-subtitle">Name and sale price are enough to start.</p>

            <form
              className="bn-stack"
              onSubmit={async (event) => {
                event.preventDefault()
                const token = getAccessToken()
                if (!token) return
                setSaving(true)
                setError(null)
                try {
                  const salePricePaise = Number(parseRupeesToPaise(salePrice || '0'))
                  const mrpPaise = mrp.trim() ? Number(parseRupeesToPaise(mrp)) : null
                  const result = await api<Product>('/api/v1/products', {
                    method: 'POST',
                    token,
                    body: JSON.stringify({
                      name,
                      salePricePaise,
                      mrpPaise,
                      sku: sku.trim() || null,
                      hsnSac: hsn.trim() || null,
                      barcode: barcode.trim() || null,
                    }),
                  })
                  setSaving(false)
                  if (result.error || !result.data) {
                    setError(result.error?.message ?? 'Could not save item.')
                    return
                  }
                  setOpen(false)
                  await load(q)
                } catch (err) {
                  setSaving(false)
                  setError(err instanceof Error ? err.message : 'Could not save item.')
                }
              }}
            >
              <Tip id="field.barcode" className="bn-tip-block">
                <label className="bn-field">
                  <span>Barcode</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="bn-input"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="Scan or type"
                      inputMode="numeric"
                    />
                    <Tip id="barcode.lookup">
                      <button
                        type="button"
                        className="bn-btn bn-btn-secondary"
                        onClick={() => void lookupBarcode()}
                        aria-label="Look up barcode"
                      >
                        <IconScan />
                      </button>
                    </Tip>
                  </div>
                  {lookupNote ? <p className="bn-field-hint">{lookupNote}</p> : null}
                </label>
              </Tip>

              <Tip id="field.itemName" className="bn-tip-block">
                <label className="bn-field">
                  <span>Name</span>
                  <input
                    className="bn-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Amul Milk 1L"
                    autoFocus
                  />
                </label>
              </Tip>

              <Tip id="field.salePrice" className="bn-tip-block">
                <label className="bn-field">
                  <span>Sale price (₹)</span>
                  <input
                    className="bn-input"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    inputMode="decimal"
                    placeholder="60"
                    required
                  />
                </label>
              </Tip>

              <Tip id="field.mrp" className="bn-tip-block">
                <label className="bn-field">
                  <span>MRP (₹) — optional</span>
                  <input
                    className="bn-input"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    inputMode="decimal"
                    placeholder="65"
                  />
                </label>
              </Tip>

              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }}>
                <Tip id="field.sku" className="bn-tip-block">
                  <label className="bn-field">
                    <span>SKU</span>
                    <input className="bn-input" value={sku} onChange={(e) => setSku(e.target.value)} />
                  </label>
                </Tip>
                <Tip id="field.hsn" className="bn-tip-block">
                  <label className="bn-field">
                    <span>HSN / SAC</span>
                    <input className="bn-input" value={hsn} onChange={(e) => setHsn(e.target.value)} />
                  </label>
                </Tip>
              </div>

              {error ? <p className="bn-alert bn-alert-error">{error}</p> : null}

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="bn-btn bn-btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save item'}
                </button>
                <button
                  className="bn-btn bn-btn-secondary"
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  )
}
