'use client'

import {
  allNavItems,
  navGroups,
  quickCreates,
  type HelpId,
  type NavGroupDef,
  type NavItemDef,
} from '@billnote/shared'
import { Button, Tip, useTheme } from '@billnote/ui'
import {
  Bell,
  CaretLeft,
  CaretRight,
  Question,
  MagnifyingGlass,
  Plus,
  SignOut,
  Translate,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  APP_LANGUAGES,
  getStoredLanguage,
  setStoredLanguage,
} from '../lib/languages'
import { NavIcon } from '../lib/nav-icons'
import { clearAccessToken } from '../lib/session'
import { CommandPalette } from './command-palette'

const SIDEBAR_KEY = 'bn_sidebar_collapsed'

function isActive(pathname: string, href: string) {
  if (href === '/app') return pathname === '/app'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function breadcrumbLabel(pathname: string) {
  const item = allNavItems().find((n) => isActive(pathname, n.href) && n.href !== '/app')
  if (pathname === '/app') return 'Dashboard'
  return item?.label ?? 'App'
}

export function AppShell({
  children,
  businessName,
}: {
  children: ReactNode
  businessName?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { resolved, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const [sideFilter, setSideFilter] = useState('')
  const [online, setOnline] = useState(true)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(SIDEBAR_KEY) === '1')
    setLanguage(getStoredLanguage())
    const groups: Record<string, boolean> = {}
    for (const g of navGroups) groups[g.id] = true
    setOpenGroups(groups)
    setOnline(navigator.onLine)
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    const onCmd = () => setCommandOpen(true)
    document.addEventListener('bn:open-command', onCmd)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
      document.removeEventListener('bn:open-command', onCmd)
    }
  }, [])

  const filteredGroups = useMemo(() => {
    const q = sideFilter.trim().toLowerCase()
    if (!q) return navGroups
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [sideFilter])

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      window.localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  return (
    <div className={`bn-shell ${collapsed ? 'bn-shell-collapsed' : ''}`}>
      <aside className="bn-sidebar" data-collapsed={collapsed ? 'true' : 'false'}>
        <div className="bn-sidebar-inner">
          <div className="bn-sidebar-top">
            <Tip id="brand.name">
              <Link href="/app" className="bn-side-brand">
                {collapsed ? 'B' : 'BILLNOTE'}
              </Link>
            </Tip>
            <Tip id="shell.collapse">
              <button
                type="button"
                className="bn-icon-btn"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={toggleCollapsed}
              >
                {collapsed ? <CaretRight size={18} /> : <CaretLeft size={18} />}
              </button>
            </Tip>
          </div>

          {!collapsed ? (
            <input
              className="bn-input bn-side-filter"
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value)}
              placeholder="Filter menu…"
              aria-label="Filter sidebar"
            />
          ) : null}

          <nav className="bn-side-nav" aria-label="Shop menu">
            {filteredGroups.map((group) => (
              <SideGroup
                key={group.id}
                group={group}
                pathname={pathname}
                collapsed={collapsed}
                open={openGroups[group.id] !== false}
                onToggle={() =>
                  setOpenGroups((prev) => ({ ...prev, [group.id]: !(prev[group.id] !== false) }))
                }
              />
            ))}
          </nav>

          <div className="bn-suggest">
            {!collapsed ? <div className="bn-suggest-title">Suggested software</div> : null}
            <Tip id="nav.suggestCrm" className="bn-tip-block">
              <Link href="/app/suggested" className="bn-suggest-card" title="Suggested software">
                <span className="bn-suggest-card-title">
                  <NavIcon name="sparkle" weight="duotone" />
                  {!collapsed ? 'Suggested Software' : null}
                </span>
                {!collapsed ? <span>CRM and more tools for your shop</span> : null}
              </Link>
            </Tip>
          </div>
        </div>
      </aside>

      <div className="bn-main-col">
        <header className="bn-topbar">
          <div className="bn-topbar-left">
            <div className="bn-mobile-brand">
              <div className="bn-brand" style={{ fontSize: '1.15rem' }}>
                BILLNOTE
              </div>
              <div className="bn-top-muted">{businessName ?? 'Your shop'}</div>
            </div>
            <div className="bn-desktop-shop">
              <button type="button" className="bn-chip-btn" title="Switch business">
                {businessName ?? 'Your shop'}
              </button>
              <Tip id="shell.branch">
                <button type="button" className="bn-chip-btn bn-chip-ghost">
                  Main · Counter 1
                </button>
              </Tip>
              <nav className="bn-breadcrumb" aria-label="Breadcrumb">
                <Link href="/app">Home</Link>
                <span>/</span>
                <span>{breadcrumbLabel(pathname)}</span>
              </nav>
            </div>
          </div>

          <div className="bn-topbar-actions">
            <Tip id="shell.search">
              <button
                type="button"
                className="bn-search-trigger"
                onClick={() => setCommandOpen(true)}
              >
                <MagnifyingGlass size={18} />
                <span className="bn-hide-sm">Search</span>
                <kbd className="bn-hide-sm">⌘K</kbd>
              </button>
            </Tip>

            <div className="bn-quick-wrap">
              <Tip id="shell.quickCreate">
                <button
                  type="button"
                  className="bn-icon-btn bn-icon-btn-brand"
                  aria-label="Quick create"
                  onClick={() => setQuickOpen((v) => !v)}
                >
                  <Plus size={18} weight="bold" />
                </button>
              </Tip>
              {quickOpen ? (
                <div className="bn-popover">
                  {quickCreates.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="bn-command-row"
                      onClick={() => {
                        setQuickOpen(false)
                        router.push(item.href)
                      }}
                    >
                      {item.label}
                      {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <Tip id="shell.notifications">
              <button
                type="button"
                className="bn-icon-btn"
                aria-label="Notifications"
                onClick={() => setNotifyOpen(true)}
              >
                <Bell size={18} />
              </button>
            </Tip>

            <Tip id="shell.sync">
              <span className={`bn-sync-pill bn-hide-md ${online ? 'is-ok' : 'is-off'}`}>
                {online ? 'All saved' : 'Offline'}
              </span>
            </Tip>

            <div className="bn-quick-wrap">
              <button
                type="button"
                className="bn-icon-btn"
                aria-label="Language"
                aria-expanded={langOpen}
                title="Language"
                onClick={() => {
                  setLangOpen((v) => !v)
                  setProfileOpen(false)
                  setQuickOpen(false)
                }}
              >
                <Translate size={18} />
              </button>
              {langOpen ? (
                <div className="bn-popover bn-popover-right bn-lang-popover" role="listbox" aria-label="Languages">
                  <div className="bn-popover-head">Language</div>
                  {APP_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      role="option"
                      aria-selected={language === lang.code}
                      className="bn-command-row"
                      data-active={language === lang.code ? 'true' : 'false'}
                      onClick={() => {
                        setStoredLanguage(lang.code)
                        setLanguage(lang.code)
                        setLangOpen(false)
                      }}
                    >
                      <span>
                        <strong>{lang.native}</strong>
                        <span className="bn-lang-meta">{lang.label}</span>
                      </span>
                      {language === lang.code ? <span className="bn-lang-check">✓</span> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="bn-chip-btn bn-hide-md"
              onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
            >
              {resolved === 'dark' ? 'Light' : 'Dark'}
            </button>

            <button
              type="button"
              className="bn-icon-btn"
              aria-label="Support"
              title="Support"
              onClick={() => {
                setSupportOpen(true)
                setLangOpen(false)
                setProfileOpen(false)
              }}
            >
              <Question size={18} weight="bold" />
            </button>

            <div className="bn-quick-wrap">
              <Tip id="shell.profile">
                <button
                  type="button"
                  className="bn-avatar-btn"
                  aria-label="Profile menu"
                  onClick={() => setProfileOpen((v) => !v)}
                >
                  {(businessName ?? 'B').slice(0, 1).toUpperCase()}
                </button>
              </Tip>
              {profileOpen ? (
                <div className="bn-popover bn-popover-right">
                  <div className="bn-popover-head">{businessName ?? 'Your shop'}</div>
                  <Link href="/app/settings" className="bn-command-row" onClick={() => setProfileOpen(false)}>
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="bn-command-row"
                    onClick={() => {
                      clearAccessToken()
                      router.push('/login')
                    }}
                  >
                    <SignOut size={16} /> Log out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {pathname === '/app' ? (
          <div className="bn-ticker" aria-label="Latest bills">
            <div className="bn-ticker-track">
              <span>Bill #BOS/0001 — ₹20.00 — Cash</span>
              <span>Bill #BOS/0002 — ₹540.00 — UPI</span>
              <span>Welcome to BILLNOTE — make your next bill from Sell → New Bill</span>
              <span>Bill #BOS/0001 — ₹20.00 — Cash</span>
              <span>Bill #BOS/0002 — ₹540.00 — UPI</span>
              <span>Welcome to BILLNOTE — make your next bill from Sell → New Bill</span>
            </div>
          </div>
        ) : null}

        <main className="bn-content">{children}</main>

        <nav className="bn-tabbar" aria-label="Main">
          <TabLink href="/app" label="Home" icon="home" pathname={pathname} />
          <TabLink href="/app/items" label="Items" icon="items" pathname={pathname} />
          <div className="bn-tab-bill-wrap">
            <Link href="/app/bill" className="bn-tab-bill" aria-label="New bill">
              <NavIcon name="bill" size={22} weight="duotone" />
              <span>Bill</span>
            </Link>
          </div>
          <TabLink href="/app/customers" label="Parties" icon="customers" pathname={pathname} />
          <TabLink href="/app/more" label="More" icon="sparkle" pathname={pathname} />
        </nav>
      </div>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />

      {notifyOpen ? (
        <div className="bn-drawer-backdrop" onClick={() => setNotifyOpen(false)} role="presentation">
          <aside className="bn-drawer" onClick={(e) => e.stopPropagation()} aria-label="Notifications">
            <div className="bn-drawer-head">
              <strong>Notifications</strong>
              <Button variant="ghost" size="sm" onClick={() => setNotifyOpen(false)}>
                Close
              </Button>
            </div>
            <p className="bn-field-hint">No new alerts. Low stock and overdue bills will show here.</p>
          </aside>
        </div>
      ) : null}

      {supportOpen ? (
        <div className="bn-drawer-backdrop" onClick={() => setSupportOpen(false)} role="presentation">
          <aside className="bn-drawer" onClick={(e) => e.stopPropagation()} aria-label="Support">
            <div className="bn-drawer-head">
              <strong>Support</strong>
              <Button variant="ghost" size="sm" onClick={() => setSupportOpen(false)}>
                Close
              </Button>
            </div>
            <div className="bn-stack" style={{ gap: 10 }}>
              <p className="bn-field-hint" style={{ margin: 0 }}>
                Get help with billing, GST, sync, or your shop setup.
              </p>
              <Link
                href="/app/help"
                className="bn-command-row"
                onClick={() => setSupportOpen(false)}
              >
                Help &amp; Learn
              </Link>
              <a className="bn-command-row" href="mailto:support@billnote.app">
                Email support
              </a>
              <a
                className="bn-command-row"
                href="https://wa.me/919999999999?text=Hi%20BILLNOTE%20Support"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp support
              </a>
              <Link
                href="/app/settings"
                className="bn-command-row"
                onClick={() => setSupportOpen(false)}
              >
                Shop settings
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  )
}

function SideGroup({
  group,
  pathname,
  collapsed,
  open,
  onToggle,
}: {
  group: NavGroupDef
  pathname: string
  collapsed: boolean
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="bn-nav-group">
      {!collapsed ? (
        <button type="button" className="bn-nav-label bn-nav-label-btn" onClick={onToggle}>
          {group.label}
          <span aria-hidden>{open ? '−' : '+'}</span>
        </button>
      ) : null}
      {(collapsed || open) &&
        group.items.map((item) => (
          <SideLink key={item.id} item={item} pathname={pathname} collapsed={collapsed} />
        ))}
    </div>
  )
}

function SideLink({
  item,
  pathname,
  collapsed,
}: {
  item: NavItemDef
  pathname: string
  collapsed: boolean
}) {
  const active = isActive(pathname, item.href)
  return (
    <Tip id={item.helpId as HelpId} className="bn-tip-block">
      <Link
        href={item.href}
        className="bn-side-link"
        data-active={active ? 'true' : 'false'}
        aria-current={active ? 'page' : undefined}
        title={item.label}
      >
        <NavIcon name={item.icon} weight={active ? 'duotone' : 'regular'} />
        {!collapsed ? <span>{item.label}</span> : null}
        {active ? <span className="bn-ink-underline" aria-hidden /> : null}
      </Link>
    </Tip>
  )
}

function TabLink({
  href,
  label,
  icon,
  pathname,
}: {
  href: string
  label: string
  icon: NavItemDef['icon']
  pathname: string
  helpId?: HelpId
}) {
  const active = isActive(pathname, href)
  return (
    <Link
      href={href}
      className="bn-tab-link"
      data-active={active ? 'true' : 'false'}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
    >
      <NavIcon name={icon} size={22} weight={active ? 'duotone' : 'regular'} />
      <span>{label}</span>
    </Link>
  )
}
