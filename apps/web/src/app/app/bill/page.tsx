'use client'

import { formatPaise, milliToDisplay, milli, paise } from '@billnote/shared'
import { Tip } from '@billnote/ui'
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '../../../components/app-shell'
import { IconPlus, IconScan } from '../../../components/icons'
import { useBarcodeWedge } from '../../../hooks/use-barcode-wedge'
import { api } from '../../../lib/api'
import { getAccessToken } from '../../../lib/session'

type Product = {
  id: string
  name: string
  salePricePaise: string
  barcode: string | null
  unitName: string
}

type CartLine = {
  productId: string
  name: string
  unitPricePaise: string
  qtyMilli: number
}

type ChargedBill = {
  id: string
  displayNumber: string | null
  status: string
  grandTotalPaise: string
  amountPaidPaise: string
  balancePaise: string
}

export default function BillPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [q, setQ] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastBill, setLastBill] = useState<ChargedBill | null>(null)
  const [manualBarcode, setManualBarcode] = useState('')
  const [ready, setReady] = useState(false)

  const loadProducts = useCallback(
    async (query = '') => {
      const token = getAccessToken()
      if (!token) {
        router.replace('/login')
        return
      }
      setLoading(true)
      const path = query.trim()
        ? `/api/v1/products?q=${encodeURIComponent(query.trim())}`
        : '/api/v1/products'
      const result = await api<Product[]>(path, { token })
      startTransition(() => {
        setLoading(false)
        if (result.error || !result.data) {
          setError(result.error?.message ?? 'Could not load items.')
          return
        }
        setProducts(result.data)
        setError(null)
      })
    },
    [router],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(true)
      void loadProducts()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadProducts])

  const addProduct = useCallback((product: Product, qtyMilli = 1000) => {
    setLastBill(null)
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === product.id)
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id ? { ...l, qtyMilli: l.qtyMilli + qtyMilli } : l,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unitPricePaise: product.salePricePaise,
          qtyMilli,
        },
      ]
    })
  }, [])

  const resolveBarcode = useCallback(
    async (code: string) => {
      const token = getAccessToken()
      if (!token || !code.trim()) return
      const local = products.find((p) => p.barcode === code.trim())
      if (local) {
        addProduct(local)
        return
      }
      const result = await api<{
        source: string
        product: Product | null
      }>('/api/v1/barcodes/lookup', {
        method: 'POST',
        token,
        body: JSON.stringify({ barcode: code.trim() }),
      })
      if (result.data?.product) {
        addProduct(result.data.product)
        return
      }
      setError(`No item for barcode ${code}. Add it under Items.`)
    },
    [addProduct, products],
  )

  useBarcodeWedge((code) => {
    void resolveBarcode(code)
  }, ready)

  const totalPaise = useMemo(() => {
    return cart.reduce((sum, line) => {
      const lineTotal =
        (BigInt(line.qtyMilli) * BigInt(line.unitPricePaise)) / 1000n
      return sum + lineTotal
    }, 0n)
  }, [cart])

  async function charge(paymentMode: 'cash' | 'upi' | 'card' | 'credit', hold = false) {
    const token = getAccessToken()
    if (!token) return
    if (!cart.length) {
      setError('Add at least one item.')
      return
    }
    setBusy(true)
    setError(null)
    const result = await api<ChargedBill>('/api/v1/pos/charge', {
      method: 'POST',
      token,
      headers: { 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify({
        paymentMode,
        hold,
        lines: cart.map((line) => ({
          productId: line.productId,
          qtyMilli: line.qtyMilli,
          unitPricePaise: Number(line.unitPricePaise),
        })),
      }),
    })
    setBusy(false)
    if (result.error || !result.data) {
      setError(result.error?.message ?? 'Could not finish the bill.')
      return
    }
    setLastBill(result.data)
    setCart([])
    window.localStorage.setItem('bn_first_bill_done', '1')
  }

  async function printReceipt(documentId: string) {
    const token = getAccessToken()
    if (!token) return
    const result = await api<{ html: string }>(`/api/v1/documents/${documentId}/receipt`, {
      token,
    })
    if (!result.data?.html) {
      setError(result.error?.message ?? 'Could not open receipt.')
      return
    }
    const win = window.open('', '_blank', 'noopener,noreferrer,width=480,height=720')
    if (!win) {
      setError('Allow pop-ups to print the receipt.')
      return
    }
    win.document.write(result.data.html)
    win.document.close()
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
        <div>
          <Tip id="nav.bill">
            <h1 className="bn-title">Bill</h1>
          </Tip>
          <p className="bn-subtitle" style={{ marginBottom: 0 }}>
            Search or scan items, then take payment.
          </p>
        </div>
        <Tip id="pos.clear">
          <button
            type="button"
            className="bn-btn bn-btn-secondary"
            disabled={!cart.length || busy}
            onClick={() => setCart([])}
          >
            Clear
          </button>
        </Tip>
      </div>

      {error ? (
        <p className="bn-alert bn-alert-error" style={{ marginTop: 14 }}>
          {error}
        </p>
      ) : null}

      {lastBill ? (
        <div className="bn-alert bn-alert-info" style={{ marginTop: 14 }}>
          <strong>
            {lastBill.status === 'held' ? 'Bill held' : 'Bill saved'}
            {lastBill.displayNumber ? ` · ${lastBill.displayNumber}` : ''}
          </strong>
          <div style={{ marginTop: 6 }}>
            Total {formatPaise(paise(lastBill.grandTotalPaise))}
            {lastBill.balancePaise !== '0'
              ? ` · Balance ${formatPaise(paise(lastBill.balancePaise))}`
              : ' · Paid'}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <Tip id="pos.receipt">
              <button
                type="button"
                className="bn-btn bn-btn-primary"
                onClick={() => void printReceipt(lastBill.id)}
              >
                Print / PDF
              </button>
            </Tip>
            <button type="button" className="bn-btn bn-btn-secondary" onClick={() => setLastBill(null)}>
              New bill
            </button>
          </div>
        </div>
      ) : null}

      <div className="bn-pos" style={{ marginTop: 16 }}>
        <section className="bn-pos-catalog">
          <div className="bn-toolbar">
            <Tip id="pos.search" className="bn-tip-block">
              <input
                className="bn-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void loadProducts(q)
                }}
                placeholder="Search items"
                aria-label="Search items"
              />
            </Tip>
            <button type="button" className="bn-btn bn-btn-secondary" onClick={() => void loadProducts(q)}>
              Search
            </button>
          </div>

          <Tip id="pos.scan" className="bn-tip-block">
            <div className="bn-toolbar">
              <input
                className="bn-input"
                data-wedge="1"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void resolveBarcode(manualBarcode)
                    setManualBarcode('')
                  }
                }}
                placeholder="Type or scan barcode"
                aria-label="Barcode"
              />
              <button
                type="button"
                className="bn-btn bn-btn-secondary"
                onClick={() => {
                  void resolveBarcode(manualBarcode)
                  setManualBarcode('')
                }}
              >
                <IconScan />
                Add
              </button>
            </div>
          </Tip>

          {loading ? (
            <p className="bn-field-hint">Loading items…</p>
          ) : products.length === 0 ? (
            <div className="bn-empty">
              <p style={{ margin: '0 0 8px', fontWeight: 650 }}>No items to sell</p>
              <p style={{ margin: '0 0 14px', color: 'var(--bn-ink-soft)', fontSize: 14 }}>
                Add products first, then come back to bill.
              </p>
              <a href="/app/items" className="bn-btn bn-btn-primary">
                <IconPlus />
                Go to Items
              </a>
            </div>
          ) : (
            <div className="bn-pos-grid">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="bn-pos-item"
                  onClick={() => addProduct(product)}
                >
                  <strong>{product.name}</strong>
                  <span style={{ color: 'var(--bn-good)', fontWeight: 700 }}>
                    {formatPaise(paise(product.salePricePaise))}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="bn-pos-cart">
          <Tip id="pos.cart">
            <h2 className="bn-section-title">This bill</h2>
          </Tip>

          {cart.length === 0 ? (
            <p className="bn-field-hint">Tap an item or scan a barcode to start.</p>
          ) : (
            <div>
              {cart.map((line) => (
                <div key={line.productId} className="bn-pos-line">
                  <div>
                    <strong>{line.name}</strong>
                    <div className="bn-list-meta">
                      {formatPaise(paise(line.unitPricePaise))} each
                    </div>
                    <div className="bn-pos-qty" style={{ marginTop: 8 }}>
                      <Tip id="pos.qty">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            setCart((prev) =>
                              prev
                                .map((l) =>
                                  l.productId === line.productId
                                    ? { ...l, qtyMilli: l.qtyMilli - 1000 }
                                    : l,
                                )
                                .filter((l) => l.qtyMilli > 0),
                            )
                          }
                        >
                          −
                        </button>
                      </Tip>
                      <span>{milliToDisplay(milli(line.qtyMilli), 0)}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          setCart((prev) =>
                            prev.map((l) =>
                              l.productId === line.productId
                                ? { ...l, qtyMilli: l.qtyMilli + 1000 }
                                : l,
                            ),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    {formatPaise(
                      paise((BigInt(line.qtyMilli) * BigInt(line.unitPricePaise)) / 1000n),
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Tip id="pos.total" className="bn-tip-block">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginTop: 8,
              }}
            >
              <span style={{ color: 'var(--bn-ink-soft)' }}>Total</span>
              <strong style={{ fontSize: '1.5rem' }}>{formatPaise(paise(totalPaise))}</strong>
            </div>
          </Tip>

          <div className="bn-pos-pay">
            <Tip id="pos.payCash">
              <button
                type="button"
                className="bn-btn bn-btn-primary"
                disabled={busy || !cart.length}
                onClick={() => void charge('cash')}
              >
                Cash
              </button>
            </Tip>
            <Tip id="pos.payUpi">
              <button
                type="button"
                className="bn-btn bn-btn-primary"
                disabled={busy || !cart.length}
                onClick={() => void charge('upi')}
              >
                UPI
              </button>
            </Tip>
            <Tip id="pos.payCard">
              <button
                type="button"
                className="bn-btn bn-btn-secondary"
                disabled={busy || !cart.length}
                onClick={() => void charge('card')}
              >
                Card
              </button>
            </Tip>
            <Tip id="pos.payCredit">
              <button
                type="button"
                className="bn-btn bn-btn-secondary"
                disabled={busy || !cart.length}
                onClick={() => void charge('credit')}
              >
                Udhaar
              </button>
            </Tip>
          </div>

          <Tip id="pos.hold" className="bn-tip-block">
            <button
              type="button"
              className="bn-btn bn-btn-ghost bn-btn-block"
              disabled={busy || !cart.length}
              onClick={() => void charge('cash', true)}
            >
              Hold bill
            </button>
          </Tip>

          <Tip id="pos.charge">
            <p className="bn-field-hint" style={{ margin: 0 }}>
              Charge finishes the bill, numbers it, and saves the payment.
            </p>
          </Tip>
        </aside>
      </div>

      {cart.length > 0 ? (
        <div className="bn-pos-totalbar" style={{ marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{cart.length} items</div>
            <strong style={{ fontSize: '1.25rem' }}>{formatPaise(paise(totalPaise))}</strong>
          </div>
          <button
            type="button"
            className="bn-btn"
            style={{ background: '#fff', color: 'var(--bn-brand-deep)' }}
            disabled={busy}
            onClick={() => void charge('cash')}
          >
            Cash pay
          </button>
        </div>
      ) : null}
    </AppShell>
  )
}
