'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Tip } from '@billnote/ui'
import { AuthLayout } from '../../components/auth-layout'
import { api } from '../../lib/api'
import { setAccessToken } from '../../lib/session'

type Mode = 'otp' | 'password'
type Step = 'form' | 'otp'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('otp')
  const [step, setStep] = useState<Step>('form')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function sendOtp() {
    setLoading(true)
    setError(null)
    setDevCode(null)
    const result = await api<{ sent: boolean; delivered?: boolean; provider?: string; devCode?: string }>(
      '/api/v1/auth/otp/request',
      {
        method: 'POST',
        body: JSON.stringify({ email: identifier.trim(), purpose: 'login' }),
      },
    )
    setLoading(false)
    if (result.error) {
      setError(result.error.message ?? 'Could not send OTP. Try again.')
      return
    }
    if (result.data?.devCode) setDevCode(result.data.devCode)
    if (result.data && result.data.delivered === false && !result.data.devCode) {
      setError(
        'OTP was created, but email delivery is not configured on the server (set EMAIL_PROVIDER=ses or smtp).',
      )
    }
    setStep('otp')
  }

  async function verifyOtp() {
    setLoading(true)
    setError(null)
    const result = await api<{ accessToken: string }>('/api/v1/auth/otp/verify-login', {
      method: 'POST',
      body: JSON.stringify({ email: identifier.trim(), code: otp.trim(), platform: 'web' }),
    })
    setLoading(false)
    if (result.error || !result.data) {
      setError(result.error?.message ?? 'That OTP is incorrect.')
      return
    }
    setAccessToken(result.data.accessToken)
    router.push('/app')
  }

  async function loginWithPassword() {
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
  }

  return (
    <AuthLayout
      title="Log in to your shop"
      subtitle="Email OTP by default — or use password if you prefer."
      footer={
        <p className="bn-muted-link">
          New here? <Link href="/signup">Create an account</Link>
        </p>
      }
    >
      <div className="bn-auth-tabs" role="tablist" aria-label="Login method">
        <button
          type="button"
          role="tab"
          className={`bn-auth-tab${mode === 'otp' ? ' is-active' : ''}`}
          aria-selected={mode === 'otp'}
          onClick={() => {
            setMode('otp')
            setStep('form')
            setError(null)
          }}
        >
          Email OTP
        </button>
        <button
          type="button"
          role="tab"
          className={`bn-auth-tab${mode === 'password' ? ' is-active' : ''}`}
          aria-selected={mode === 'password'}
          onClick={() => {
            setMode('password')
            setStep('form')
            setError(null)
          }}
        >
          Password
        </button>
      </div>

      {mode === 'otp' && step === 'form' ? (
        <form
          className="bn-stack"
          onSubmit={async (event) => {
            event.preventDefault()
            await sendOtp()
          }}
        >
          <Tip id="field.loginId">
            <label className="bn-field">
              <span>Email</span>
              <input
                className="bn-input"
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="email"
                placeholder="you@shop.com"
                required
              />
              <p className="bn-field-hint">We will send a 6-digit code to this inbox.</p>
            </label>
          </Tip>

          {error ? <p className="bn-alert bn-alert-error">{error}</p> : null}

          <button className="bn-btn bn-btn-primary bn-btn-block" type="submit" disabled={loading}>
            {loading ? 'Sending code…' : 'Send OTP'}
          </button>
        </form>
      ) : null}

      {mode === 'otp' && step === 'otp' ? (
        <form
          className="bn-stack"
          onSubmit={async (event) => {
            event.preventDefault()
            await verifyOtp()
          }}
        >
          <p className="bn-field-hint" style={{ marginTop: 0 }}>
            Code sent to <strong>{identifier.trim()}</strong>
          </p>
          {devCode ? (
            <p className="bn-alert">Dev OTP: <strong>{devCode}</strong></p>
          ) : null}
          <label className="bn-field">
            <span>Enter OTP</span>
            <input
              className="bn-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              required
              minLength={6}
              maxLength={6}
            />
          </label>

          {error ? <p className="bn-alert bn-alert-error">{error}</p> : null}

          <button className="bn-btn bn-btn-primary bn-btn-block" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify & log in'}
          </button>
          <button
            className="bn-btn bn-btn-block"
            type="button"
            disabled={loading}
            onClick={() => void sendOtp()}
          >
            Resend code
          </button>
          <button
            className="bn-btn bn-btn-block"
            type="button"
            disabled={loading}
            onClick={() => {
              setStep('form')
              setOtp('')
              setError(null)
            }}
          >
            Change email
          </button>
        </form>
      ) : null}

      {mode === 'password' ? (
        <form
          className="bn-stack"
          onSubmit={async (event) => {
            event.preventDefault()
            await loginWithPassword()
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
      ) : null}
    </AuthLayout>
  )
}
