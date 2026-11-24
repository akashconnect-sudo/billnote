'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Tip } from '@billnote/ui'
import { AuthLayout } from '../../components/auth-layout'
import { api } from '../../lib/api'
import { setAccessToken } from '../../lib/session'

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <AuthLayout
      title="Log in to your shop"
      subtitle="Use the same account on phone, computer, and web."
      footer={
        <p className="bn-muted-link">
          New here? <Link href="/signup">Create an account</Link>
        </p>
      }
    >
      <form
        className="bn-stack"
        onSubmit={async (event) => {
          event.preventDefault()
          setLoading(true)
          setError(null)
          const result = await api<{ accessToken: string }>('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({ identifier, password, platform: 'web' }),
          })
          setLoading(false)
          if (result.error || !result.data) {
            setError(result.error?.message ?? 'Could not log in. Check your details and try again.')
            return
          }
          setAccessToken(result.data.accessToken)
          router.push('/app')
        }}
      >
        <Tip id="field.loginId">
          <label className="bn-field">
            <span>Email or phone</span>
            <input
              className="bn-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              inputMode="email"
              placeholder="you@shop.com or +9198…"
              required
            />
            <p className="bn-field-hint">Example: +919876543210</p>
          </label>
        </Tip>

        <label className="bn-field">
          <span>Password</span>
          <input
            className="bn-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="bn-alert bn-alert-error">{error}</p> : null}

        <button className="bn-btn bn-btn-primary bn-btn-block" type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}
