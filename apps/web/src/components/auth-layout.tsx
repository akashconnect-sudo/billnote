import Image from 'next/image'
import { Tip } from '@billnote/ui'
import type { ReactNode } from 'react'

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="bn-auth-page">
      <aside className="bn-auth-panel" aria-hidden="true">
        <div className="bn-auth-panel-inner">
          <div className="bn-auth-brand-row">
            <Image
              src="/brand/logo.jpg"
              alt=""
              width={56}
              height={56}
              className="bn-auth-logo"
              priority
            />
            <div>
              <div className="bn-auth-wordmark">BILLNOTE</div>
              <p className="bn-auth-tagline">
                Professional billing for Indian shops — clear GST invoices, faster checkout.
              </p>
            </div>
          </div>

          <div className="bn-auth-hero">
            <Image
              src="/brand/auth-hero.jpg"
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 48vw"
              className="bn-auth-hero-img"
              priority
            />
            <div className="bn-auth-hero-fade" />
          </div>

          <ul className="bn-auth-points">
            <li>Issue GST-ready invoices and track every payment in one place.</li>
            <li>Built for counters, tablets, and desktops — same account everywhere.</li>
            <li>Plain language your staff can learn in minutes, not manuals.</li>
          </ul>
        </div>
      </aside>

      <main className="bn-auth-main">
        <div className="bn-auth-card">
          <div className="bn-auth-card-brand">
            <Image src="/brand/logo.jpg" alt="" width={40} height={40} className="bn-auth-logo-sm" />
            <Tip id="brand.name">
              <h1 className="bn-brand">BILLNOTE</h1>
            </Tip>
          </div>
          <h2 className="bn-title" style={{ marginTop: 18 }}>
            {title}
          </h2>
          <p className="bn-subtitle">{subtitle}</p>
          {children}
          {footer ? <div style={{ marginTop: 20 }}>{footer}</div> : null}
        </div>
      </main>
    </div>
  )
}
