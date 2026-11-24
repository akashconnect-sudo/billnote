'use client'

import { useEffect, useState } from 'react'

export function ServiceWorkerRegister() {
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    // Dev: unregister broken workers that cache Turbopack/webpack chunks.
    if (process.env.NODE_ENV === 'development') {
      void navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) void reg.unregister()
      })
      if ('caches' in window) {
        void caches.keys().then((keys) => {
          for (const key of keys) void caches.delete(key)
        })
      }
      return
    }

    void navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing
        if (!worker) return
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateReady(true)
          }
        })
      })
    })
  }, [])

  if (!updateReady) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 50,
        background: 'var(--bn-ink)',
        color: 'var(--bn-card)',
        borderRadius: 12,
        padding: 12,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <span>New version available</span>
      <button
        type="button"
        style={{
          minHeight: 40,
          borderRadius: 8,
          border: 'none',
          background: 'var(--bn-brand)',
          color: '#fff',
          padding: '0 12px',
          cursor: 'pointer',
        }}
        onClick={() => window.location.reload()}
      >
        Update now
      </button>
    </div>
  )
}
