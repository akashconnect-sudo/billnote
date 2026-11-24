'use client'

import { useEffect, useState } from 'react'

export type CountUpProps = {
  value: number
  durationMs?: number
  format?: (n: number) => string
}

export function CountUp({ value, durationMs = 640, format }: CountUpProps) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const from = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(from + (value - from) * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, durationMs])

  const display = format ? format(shown) : Math.round(shown).toLocaleString('en-IN')
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{display}</span>
}
