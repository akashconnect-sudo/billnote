import Image from 'next/image'
import Link from 'next/link'
import { Tip } from '@billnote/ui'

export default function HomePage() {
  return (
    <main className="bn-landing">
      <div className="bn-landing-brand">
        <Image src="/brand/logo.jpg" alt="" width={72} height={72} className="bn-auth-logo" priority />
        <Tip id="brand.name">
          <h1 className="bn-brand" style={{ fontSize: 'clamp(2.6rem, 8vw, 4.2rem)' }}>
            BILLNOTE
          </h1>
        </Tip>
      </div>
      <p
        style={{
          margin: '16px 0 0',
          maxWidth: 34 * 16,
          fontSize: '1.15rem',
          color: 'var(--bn-ink-soft)',
        }}
      >
        Billing software for Indian shops — clear words, fast bills, works on every device.
      </p>
      <div className="bn-landing-actions">
        <Link href="/signup" className="bn-btn bn-btn-primary">
          Create account
        </Link>
        <Link href="/login" className="bn-btn bn-btn-secondary">
          Log in
        </Link>
      </div>
      <p style={{ marginTop: 28, color: 'var(--bn-ink-soft)', fontSize: '0.95rem' }}>
        Grocery, pharmacy, salon, restaurant, freelancer — pick your type after signup.
      </p>
    </main>
  )
}
