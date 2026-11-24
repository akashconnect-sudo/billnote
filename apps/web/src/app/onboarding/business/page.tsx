'use client'

import { Tip } from '@billnote/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '../../../lib/api'
import { getAccessToken, setAccessToken } from '../../../lib/session'

const categories = [
  { key: 'grocery', label: 'Grocery / Kirana', hint: 'Daily needs, kirana, general store' },
  { key: 'restaurant', label: 'Restaurant / Cafe', hint: 'Dine-in, takeaway, cloud kitchen' },
  { key: 'pharmacy', label: 'Pharmacy', hint: 'Medicines and health products' },
  { key: 'salon', label: 'Salon / Spa', hint: 'Services with packages and tips' },
  { key: 'freelancer', label: 'Freelancer / Agency', hint: 'Invoices for projects and retainers' },
  { key: 'custom', label: 'Other / Custom', hint: 'Any other kind of shop' },
]

export default function OnboardingBusinessPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [categoryKey, setCategoryKey] = useState('grocery')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <main className="bn-auth-main" style={{ minHeight: '100vh' }}>
      <div className="bn-auth-card" style={{ width: 'min(100%, 520px)' }}>
        <p className="bn-brand" style={{ fontSize: '1.6rem' }}>
          BILLNOTE
        </p>
        <h1 className="bn-title" style={{ marginTop: 14 }}>
          Set up your shop
        </h1>
        <p className="bn-subtitle">Choose a business type. You can rename labels later.</p>

        <form
          className="bn-stack"
          onSubmit={async (event) => {
            event.preventDefault()
            const token = getAccessToken()
            if (!token) {
              router.push('/login')
              return
            }
            setLoading(true)
            setError(null)
            const idempotencyKey = crypto.randomUUID()
            const result = await api<{ id: string; accessToken?: string }>('/api/v1/businesses', {
              method: 'POST',
              token,
              headers: { 'Idempotency-Key': idempotencyKey },
              body: JSON.stringify({
                legalName: displayName,
                displayName,
                categoryKey,
              }),
            })
            setLoading(false)
            if (result.error || !result.data) {
              setError(result.error?.message ?? 'Could not create shop.')
              return
            }
            if (result.data.accessToken) setAccessToken(result.data.accessToken)
            window.sessionStorage.setItem('bn_business_id', result.data.id)
            router.push('/onboarding/permissions')
          }}
        >
          <label className="bn-field">
            <span>Shop name</span>
            <input
              className="bn-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Akash Kirana"
              required
              autoFocus
            />
          </label>

          <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
            <legend className="bn-field" style={{ marginBottom: 8 }}>
              <span>Business type</span>
            </legend>
            <div className="bn-choice-grid">
              {categories.map((cat) => (
                <label key={cat.key} className="bn-choice">
                  <input
                    type="radio"
                    name="category"
                    checked={categoryKey === cat.key}
                    onChange={() => setCategoryKey(cat.key)}
                  />
                  <span>
                    <strong style={{ display: 'block' }}>{cat.label}</strong>
                    <span className="bn-field-hint">{cat.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error ? <p className="bn-alert bn-alert-error">{error}</p> : null}

          <Tip id="action.newBill">
            <button className="bn-btn bn-btn-primary bn-btn-block" type="submit" disabled={loading}>
              {loading ? 'Creating shop…' : 'Continue'}
            </button>
          </Tip>
        </form>
      </div>
    </main>
  )
}
