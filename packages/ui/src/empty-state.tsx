'use client'

import type { ReactNode } from 'react'
import { cn } from './lib/cn.js'

export type EmptyStateProps = {
  title: string
  body: string
  illustration?: ReactNode
  action?: ReactNode
  className?: string
}

/** Simple notebook empty illustration — brand colors only. */
export function EmptyIllustration({ kind = 'bills' }: { kind?: 'bills' | 'items' | 'people' }) {
  const accent = 'var(--bn-brand)'
  return (
    <svg width="88" height="72" viewBox="0 0 88 72" fill="none" aria-hidden="true">
      <rect x="18" y="8" width="52" height="56" rx="8" stroke={accent} strokeWidth="2" fill="var(--bn-brand-soft)" />
      <path d="M28 24h32M28 34h24M28 44h28" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {kind === 'items' ? (
        <circle cx="62" cy="52" r="10" fill={accent} opacity="0.2" stroke={accent} strokeWidth="2" />
      ) : null}
      {kind === 'people' ? (
        <circle cx="44" cy="20" r="6" stroke={accent} strokeWidth="2" />
      ) : null}
    </svg>
  )
}

export function EmptyState({ title, body, illustration, action, className }: EmptyStateProps) {
  return (
    <div className={cn('bn-empty-state', className)}>
      {illustration ?? <EmptyIllustration />}
      <h3 className="bn-empty-title">{title}</h3>
      <p className="bn-empty-body">{body}</p>
      {action}
    </div>
  )
}
