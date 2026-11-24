'use client'

import { getHelp, motion, type HelpId } from '@billnote/shared'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { cn } from './lib/cn.js'

export type TipProps = {
  id: HelpId
  children: ReactNode
  className?: string
  showInfoIcon?: boolean
}

type TipPosition = {
  top: number
  left: number
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Tip({ id, children, className, showInfoIcon = false }: TipProps) {
  const tipId = useId()
  const text = getHelp(id)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<TipPosition>({ top: 0, left: 0 })
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHoverTimer = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
  }, [])

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const placeBubble = useCallback(() => {
    const el = wrapRef.current
    if (!el || typeof window === 'undefined') return
    const rect = el.getBoundingClientRect()
    const estimatedWidth = Math.min(260, window.innerWidth - 24)
    let left = rect.left + rect.width / 2 - estimatedWidth / 2
    left = Math.max(12, Math.min(left, window.innerWidth - estimatedWidth - 12))
    let top = rect.bottom + 8
    if (top + 80 > window.innerHeight) {
      top = Math.max(12, rect.top - 72)
    }
    setPosition({ top, left })
  }, [])

  const show = useCallback(() => {
    placeBubble()
    setOpen(true)
  }, [placeBubble])

  const hide = useCallback(() => {
    clearHoverTimer()
    clearLongPressTimer()
    setOpen(false)
  }, [clearHoverTimer, clearLongPressTimer])

  const onPointerEnter = useCallback(
    (event: PointerEvent<HTMLSpanElement>) => {
      if (event.pointerType !== 'mouse') return
      clearHoverTimer()
      const delay = prefersReducedMotion() ? 0 : motion.tipDelayMs
      hoverTimer.current = setTimeout(show, delay)
    },
    [clearHoverTimer, show],
  )

  const useContents = Boolean(className?.includes('bn-tip-contents'))

  useEffect(() => {
    if (!open) return
    const onScroll = () => hide()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', hide)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', hide)
    }
  }, [open, hide])

  useEffect(() => {
    return () => {
      clearHoverTimer()
      clearLongPressTimer()
    }
  }, [clearHoverTimer, clearLongPressTimer])

  return (
    <span
      ref={wrapRef}
      className={cn(className)}
      data-help-id={id}
      onPointerEnter={useContents ? undefined : onPointerEnter}
      onPointerLeave={useContents ? undefined : hide}
      onFocus={(event) => {
        // Don't steal focus from buttons/links that open their own menus.
        if (useContents) return
        const target = event.target as HTMLElement
        if (target.closest('button, a, input, select, textarea')) return
        show()
      }}
      onBlur={useContents ? undefined : hide}
      onPointerDown={
        useContents
          ? undefined
          : (event) => {
              if (event.pointerType === 'mouse') return
              clearLongPressTimer()
              longPressTimer.current = setTimeout(show, 450)
            }
      }
      onPointerUp={useContents ? undefined : clearLongPressTimer}
      onPointerCancel={useContents ? undefined : clearLongPressTimer}
      onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
        if (event.key === 'Escape') hide()
      }}
      style={
        useContents
          ? undefined
          : { display: 'inline-flex', alignItems: 'center', gap: 4, position: 'relative' }
      }
    >
      {children}
      {showInfoIcon ? (
        <button
          type="button"
          className="bn-tip-info"
          aria-label={`Help: ${text}`}
          aria-describedby={open ? tipId : undefined}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            if (open) hide()
            else show()
          }}
        >
          i
        </button>
      ) : null}
      {open ? (
        <span
          id={tipId}
          role="tooltip"
          className="bn-tip-bubble"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 1000,
          }}
        >
          {text}
        </span>
      ) : null}
    </span>
  )
}
