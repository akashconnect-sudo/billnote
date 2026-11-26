'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthLayout } from '../../components/auth-layout'
import { api } from '../../lib/api'
import { setAccessToken } from '../../lib/session'

type Step = 'form' | 'otp'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
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
        body: JSON.stringify({ email: email.trim(), purpose: 'signup' }),
      },
    )
    setLoading(false)
    if (result.error) {
      setError(result.error.message ?? 'Could not send OTP. Try another email.')
      return false
    }
    if (result.data?.devCode) setDevCode(result.data.devCode)
    if (result.data && result.data.delivered === false && !result.data.devCode) {
      setError(
        'OTP was created, but email delivery is not configured on the server (set EMAIL_PROVIDER=ses or smtp).',
      )
    }
    setStep('otp')
    return true
  }

  async function verifyAndCreate() {
    setLoading(true)
    setError(null)
    const result = await api<{ accessToken: string }>('/api/v1/auth/otp/verify-signup', {
      method: 'POST',
      body: JSON.stringify({
        fullName,
        email: email.trim(),
        password,
        code: otp.trim(),
        platform: 'web',
      }),
    })
    setLoading(false)
    if (result.error || !result.data) {
      setError(result.error?.message ?? 'Could not create account. Check the OTP and try again.')
      return
    }
    setAccessToken(result.data.accessToken)
    router.push('/onboarding/business')
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="We verify your email with a one-time code before the account is created."
      footer={
        <p className="bn-muted-link">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      }
    >
      {step === 'form' ? (
        <form
          className="bn-stack"
          onSubmit={async (event) => {
            event.preventDefault()
            await sendOtp()
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
            <p className="bn-field-hint">OTP will be sent here to verify the account.</p>
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
            {loading ? 'Sending OTP…' : 'Send email OTP'}
          </button>
        </form>
      ) : (
        <form
          className="bn-stack"
          onSubmit={async (event) => {
            event.preventDefault()
            await verifyAndCreate()
          }}
        >
          <p className="bn-field-hint" style={{ marginTop: 0 }}>
            Enter the 6-digit code sent to <strong>{email.trim()}</strong>
          </p>
          {devCode ? (
            <p className="bn-alert">Dev OTP: <strong>{devCode}</strong></p>
          ) : null}

          <label className="bn-field">
            <span>Email OTP</span>
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
            {loading ? 'Creating…' : 'Verify & create account'}
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
            Edit details
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
