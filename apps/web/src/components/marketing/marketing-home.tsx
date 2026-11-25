import Image from 'next/image'
import Link from 'next/link'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

const shopTypes = [
  'Grocery',
  'Pharmacy',
  'Salon',
  'Restaurant',
  'Kirana',
  'Electronics',
  'Hardware',
  'Boutique',
  'Clinic',
  'Freelancer',
]

const productBlocks = [
  {
    id: 'billing',
    title: 'Billing & POS',
    copy: 'Raise a GST bill in seconds. Barcode wedge, hold bills, and print without leaving the counter.',
  },
  {
    id: 'stock',
    title: 'Stock that stays honest',
    copy: 'Batches, low-stock nudges, transfers between godowns, and count sessions your staff can finish before closing.',
  },
  {
    id: 'gst',
    title: 'GST without the headache',
    copy: 'CGST/SGST/IGST on every line, credit notes, and ledgers that match what your CA asks for.',
  },
  {
    id: 'crm-overview',
    title: 'CRM for shop customers',
    copy: 'Remember who owes you, who buys often, and who needs a follow-up — udhaar, loyalty, and party history in one trail.',
  },
  {
    id: 'payments',
    title: 'Payments that reconcile',
    copy: 'Cash, UPI, bank, and cheque in the same daybook. Closing the till stops being a guessing game.',
  },
  {
    id: 'reports',
    title: 'Reports you can explain',
    copy: 'Sales, purchase, aging, P&L, and staff — plain numbers for the owner, not a spreadsheet maze.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Create your shop',
    copy: 'Pick grocery, pharmacy, salon, or your own type. Staff join with roles, not shared passwords.',
  },
  {
    n: '02',
    title: 'Bill from any screen',
    copy: 'Phone at the counter, tablet at the till, desktop in the back office — same account, same stock.',
  },
  {
    n: '03',
    title: 'Close the day clean',
    copy: 'Daybook, udhaar, and GST sit ready when you shut the shutter.',
  },
]

const supportItems = [
  {
    title: 'In-app help',
    copy: 'Tips on every screen in plain language — built for staff who learn on the job.',
  },
  {
    title: 'Setup guidance',
    copy: 'Taxes, templates, and permissions walked through once, then remembered.',
  },
  {
    title: 'Human desk',
    copy: 'Stuck on GST or stock? Reach Support from the app when you need a person, not a bot wall.',
  },
]

export function MarketingHome() {
  return (
    <div className="mkt">
      <SiteHeader />

      <main>
        <section className="mkt-hero" aria-labelledby="mkt-hero-brand">
          <div className="mkt-hero-media" aria-hidden>
            <Image
              src="/brand/auth-hero.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="mkt-hero-img"
            />
            <div className="mkt-hero-veil" />
          </div>
          <div className="mkt-hero-copy">
            <p className="mkt-kicker mkt-reveal">For Indian shops</p>
            <h1 id="mkt-hero-brand" className="mkt-hero-brand mkt-reveal mkt-reveal-delay-1">
              BILLNOTE
            </h1>
            <p className="mkt-hero-line mkt-reveal mkt-reveal-delay-2">
              Fast bills. Clear GST. Customers you actually remember.
            </p>
            <p className="mkt-hero-sub mkt-reveal mkt-reveal-delay-3">
              One billing home for counters, tablets, and desktops — stock, CRM, and daybook included.
            </p>
            <div className="mkt-hero-cta mkt-reveal mkt-reveal-delay-4">
              <Link href="/signup" className="mkt-btn mkt-btn-solid mkt-btn-lg">
                Create account
              </Link>
              <Link href="/login" className="mkt-btn mkt-btn-light mkt-btn-lg">
                Log in
              </Link>
            </div>
          </div>
        </section>

        <section className="mkt-marquee" aria-label="Shop types" id="shops">
          <div className="mkt-marquee-track">
            {[...shopTypes, ...shopTypes].map((shop, i) => (
              <span key={`${shop}-${i}`} className="mkt-marquee-item">
                {shop}
              </span>
            ))}
          </div>
        </section>

        <section className="mkt-section" id="how">
          <div className="mkt-section-head">
            <h2 className="mkt-h2">How shops run the day</h2>
            <p className="mkt-lede">Three steps. No training deck. No jargon wall.</p>
          </div>
          <ol className="mkt-steps">
            {steps.map((step) => (
              <li key={step.n} className="mkt-step">
                <span className="mkt-step-n">{step.n}</span>
                <h3 className="mkt-h3">{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mkt-section mkt-section-tint" id="products">
          <div className="mkt-section-head">
            <h2 className="mkt-h2">Products that earn their place</h2>
            <p className="mkt-lede">
              Billing first. CRM, stock, GST, payments, and reports sit under the same roof — not bolted on later.
            </p>
          </div>
          <div className="mkt-product-rail">
            {productBlocks.map((block) => (
              <article key={block.id} id={block.id} className="mkt-product">
                <h3 className="mkt-h3">{block.title}</h3>
                <p>{block.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mkt-crm" id="crm" aria-labelledby="crm-title">
          <div className="mkt-crm-copy">
            <p className="mkt-kicker mkt-kicker-ink">Inside Products</p>
            <h2 id="crm-title" className="mkt-h2">
              CRM that knows your regulars
            </h2>
            <p className="mkt-lede">
              Not a sales funnel toy — a shop CRM. Track udhaar, loyalty points, last visit, and who to call before the
              festival rush.
            </p>
            <ul className="mkt-checklist">
              <li>Party ledger with clear balances</li>
              <li>Follow-ups tied to real bills</li>
              <li>Loyalty without a separate app</li>
            </ul>
            <Link href="/signup" className="mkt-btn mkt-btn-solid">
              Try CRM with billing
            </Link>
          </div>
          <div className="mkt-crm-stage" aria-hidden>
            <div className="mkt-crm-sheet mkt-crm-sheet-a">
              <span>Rita Medicals</span>
              <strong>₹12,480 udhaar</strong>
              <em>Last bill · yesterday</em>
            </div>
            <div className="mkt-crm-sheet mkt-crm-sheet-b">
              <span>Loyalty</span>
              <strong>240 pts</strong>
              <em>Redeem at counter</em>
            </div>
            <div className="mkt-crm-sheet mkt-crm-sheet-c">
              <span>Follow-up</span>
              <strong>Call before Holi</strong>
              <em>Bulk order · 18 Mar</em>
            </div>
          </div>
        </section>

        <section className="mkt-section" id="support">
          <div className="mkt-section-head">
            <h2 className="mkt-h2">Support when the counter is busy</h2>
            <p className="mkt-lede">Help lives in the product. People are a tap away when tips are not enough.</p>
          </div>
          <div className="mkt-support-grid">
            {supportItems.map((item) => (
              <article key={item.title} className="mkt-support-item">
                <h3 className="mkt-h3">{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mkt-close">
          <div className="mkt-close-inner">
            <h2 className="mkt-h2 mkt-h2-on-dark">Open your shop on BILLNOTE</h2>
            <p>Create an account in minutes. Log in when you already have one.</p>
            <div className="mkt-hero-cta">
              <Link href="/signup" className="mkt-btn mkt-btn-light mkt-btn-lg">
                Create account
              </Link>
              <Link href="/login" className="mkt-btn mkt-btn-outline-light mkt-btn-lg">
                Log in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
