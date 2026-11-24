'use client'

import { useEffect, useRef } from 'react'

/**
 * USB/Bluetooth wedge scanners type fast and end with Enter.
 * Ignore slow human typing (average gap > 30ms).
 */
export function useBarcodeWedge(onScan: (code: string) => void, enabled = true) {
  const buffer = useRef('')
  const lastAt = useRef(0)
  const onScanRef = useRef(onScan)
  onScanRef.current = onScan

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isField = tag === 'input' || tag === 'textarea' || target?.isContentEditable
      if (isField && (target as HTMLInputElement).dataset.wedge !== '1') return

      const now = Date.now()
      if (now - lastAt.current > 40) buffer.current = ''
      lastAt.current = now

      if (event.key === 'Enter') {
        const code = buffer.current.trim()
        buffer.current = ''
        if (code.length >= 4) {
          event.preventDefault()
          onScanRef.current(code)
        }
        return
      }

      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        buffer.current += event.key
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
