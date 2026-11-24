'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Button } from './button.js'

export type ToastItem = {
  id: string
  title: string
  body?: string
  durationMs?: number
  onUndo?: () => void
}

type ToastContextValue = {
  push: (toast: Omit<ToastItem, 'id'> & { id?: string }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (toast: Omit<ToastItem, 'id'> & { id?: string }) => {
      const id = toast.id ?? crypto.randomUUID()
      const durationMs = toast.durationMs ?? 4000
      setItems((prev) => [...prev, { ...toast, id, durationMs }])
      window.setTimeout(() => dismiss(id), durationMs)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="bn-toast-viewport" aria-live="polite">
        {items.map((toast) => (
          <div key={toast.id} className="bn-toast" role="status">
            <strong style={{ display: 'block', fontSize: 14 }}>{toast.title}</strong>
            {toast.body ? (
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--bn-muted)' }}>{toast.body}</p>
            ) : null}
            {toast.onUndo ? (
              <Button
                variant="ghost"
                size="sm"
                style={{ marginTop: 6 }}
                onClick={() => {
                  toast.onUndo?.()
                  dismiss(toast.id)
                }}
              >
                Undo
              </Button>
            ) : null}
            <div
              className="bn-toast-bar"
              style={{ animationDuration: `${toast.durationMs ?? 4000}ms` }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
