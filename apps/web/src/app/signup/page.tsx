'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthLayout } from '../../components/auth-layout'
import { api } from '../../lib/api'
import { setAccessToken } from '../../lib/session'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Takes under a minute. You can add Hindi later from settings."
      footer={
        <p className="bn-muted-link">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      }
    >
      <form
        className="bn-stack"
        onSubmit={async (event) => {
          event.preventDefault()
          setLoading(true)
          setError(null)
          const result = await api<{ accessToken: string }>('/api/v1/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
              fullName,
              email,
              password,
              platform: 'web',
            }),
          })
          setLoading(false)
          if (result.error || !result.data) {
            setError(result.error?.message ?? 'Could not create account. Try another email.')
            return
          }
          setAccessToken(result.data.accessToken)
          router.push('/onboarding/business')
        }}
      >
        <label className="bn-field">
          <span>Your name</span>
          <input
            className="bn-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            placeholder="Akash"
            required
          />
        </label>

        <label className="bn-field">
          <span>Email</span>
          <input
            className="bn-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@shop.com"
            required
          />
        </label>

        <label className="bn-field">
          <span>Password</span>
          <input
            className="bn-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="bn-field-hint">At least 8 characters</p>
        </label>

        {error ? <p className="bn-alert bn-alert-error">{error}</p> : null}

        <button className="bn-btn bn-btn-primary bn-btn-block" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
