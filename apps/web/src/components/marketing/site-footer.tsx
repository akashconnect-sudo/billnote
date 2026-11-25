import Image from 'next/image'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mkt-footer">
      <div className="mkt-footer-grid">
        <div className="mkt-footer-brand">
          <div className="mkt-footer-logo">
            <Image src="/brand/logo.jpg" alt="" width={40} height={40} className="mkt-logo-mark" />
            <span className="mkt-logo-word">BILLNOTE</span>
          </div>
          <p>Billing built for Indian counters — GST, stock, CRM, and daybook in one place.</p>
        </div>

        <div>
          <h2 className="mkt-footer-heading">Products</h2>
          <ul className="mkt-footer-list">
            <li>
              <a href="#billing">Billing & POS</a>
            </li>
            <li>
              <a href="#crm">CRM</a>
            </li>
            <li>
              <a href="#stock">Stock</a>
            </li>
            <li>
              <a href="#gst">GST</a>
            </li>
            <li>
              <a href="#reports">Reports</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mkt-footer-heading">Support</h2>
          <ul className="mkt-footer-list">
            <li>
              <a href="#support">Help centre</a>
            </li>
            <li>
              <a href="#support">WhatsApp desk</a>
            </li>
            <li>
              <Link href="/login">Account login</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mkt-footer-heading">Get started</h2>
          <ul className="mkt-footer-list">
            <li>
              <Link href="/signup">Create account</Link>
            </li>
            <li>
              <Link href="/login">Log in</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mkt-footer-bar">
        <span>© {new Date().getFullYear()} BILLNOTE</span>
        <span>Works on phone, tablet, and desktop</span>
      </div>
    </footer>
  )
}
