'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'bn_install_dismissed'
const FIRST_BILL_KEY = 'bn_first_bill_done'

export function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [iosGuide, setIosGuide] = useState(false)

  useEffect(() => {
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === '1'
    const firstBillDone = window.localStorage.getItem(FIRST_BILL_KEY) === '1'
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true

    if (dismissed || standalone || !firstBillDone) return

    if (isIos) {
      setIosGuide(true)
      setVisible(true)
      return
    }

    const onPrompt = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Install BILLNOTE"
      className="bn-alert bn-alert-info"
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 80,
        zIndex: 40,
        boxShadow: 'var(--bn-shadow)',
        background: 'var(--bn-card)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 6 }}>Install BILLNOTE</strong>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>
        {iosGuide
          ? 'On iPhone: tap Share, then Add to Home Screen.'
          : 'Add BILLNOTE to your home screen for faster billing.'}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {!iosGuide && deferred ? (
          <button
            type="button"
            className="bn-btn bn-btn-primary"
            onClick={async () => {
              await deferred.prompt()
              setVisible(false)
            }}
          >
            Install
          </button>
        ) : null}
        <button
          type="button"
          className="bn-btn bn-btn-secondary"
          onClick={() => {
            window.localStorage.setItem(DISMISS_KEY, '1')
            setVisible(false)
          }}
        >
          Don&apos;t show again
        </button>
        <button type="button" className="bn-btn bn-btn-ghost" onClick={() => setVisible(false)}>
          Not now
        </button>
      </div>
    </div>
  )
}
