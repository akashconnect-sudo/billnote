'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

const productLinks = [
  { href: '#billing', label: 'Billing & POS', hint: 'Counter-ready bills and GST invoices' },
  { href: '#stock', label: 'Stock & batches', hint: 'Low stock alerts, transfers, counts' },
  { href: '#gst', label: 'GST & ledgers', hint: 'Daybook, tax, and party balances' },
  { href: '#crm', label: 'CRM & customers', hint: 'Udhaar, loyalty, follow-ups' },
  { href: '#payments', label: 'Payments & UPI', hint: 'Cash, bank, and settlement trails' },
  { href: '#reports', label: 'Reports', hint: 'Sales, purchase, P&L, aging' },
]

const navLinks = [
  { href: '#how', label: 'How it works' },
  { href: '#shops', label: 'Shops' },
  { href: '#support', label: 'Support' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuId = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const drawer =
    mounted &&
    createPortal(
      <div
        id={menuId}
        className={`mkt-drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <button
          type="button"
          className="mkt-drawer-backdrop"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <nav className="mkt-drawer-panel" aria-label="Mobile">
          <p className="mkt-drawer-label">Products</p>
          {productLinks.map((item) => (
            <a key={item.href} href={item.href} className="mkt-drawer-link" onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <p className="mkt-drawer-label">Explore</p>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="mkt-drawer-link" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="mkt-drawer-actions">
            <Link href="/login" className="mkt-btn mkt-btn-ghost" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link href="/signup" className="mkt-btn mkt-btn-solid" onClick={() => setOpen(false)}>
              Create account
            </Link>
          </div>
        </nav>
      </div>,
      document.body,
    )

  return (
    <header className={`mkt-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-menu-open' : ''}`}>
      <div className="mkt-header-inner">
        <Link href="/" className="mkt-logo" onClick={() => setOpen(false)}>
          <Image src="/brand/logo.jpg" alt="" width={36} height={36} className="mkt-logo-mark" priority />
          <span className="mkt-logo-word">BILLNOTE</span>
        </Link>

        <nav className="mkt-nav-desktop" aria-label="Primary">
          <div
            className={`mkt-products${productsOpen ? ' is-open' : ''}`}
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              type="button"
              className="mkt-nav-link mkt-nav-trigger"
              aria-expanded={productsOpen}
              aria-controls={`${menuId}-products`}
              onClick={() => setProductsOpen((v) => !v)}
            >
              Products
              <span className="mkt-chevron" aria-hidden />
            </button>
            <div id={`${menuId}-products`} className="mkt-products-panel" role="menu">
              {productLinks.map((item) => (
                <a key={item.href} href={item.href} className="mkt-products-item" role="menuitem">
                  <span className="mkt-products-label">{item.label}</span>
                  <span className="mkt-products-hint">{item.hint}</span>
                </a>
              ))}
            </div>
          </div>

          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="mkt-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mkt-header-actions">
          <Link href="/login" className="mkt-link-quiet">
            Log in
          </Link>
          <Link href="/signup" className="mkt-btn mkt-btn-solid">
            Start free
          </Link>
          <button
            type="button"
            className={`mkt-burger${open ? ' is-open' : ''}`}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {drawer}
    </header>
  )
}
