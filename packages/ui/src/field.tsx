'use client'

import type { ReactNode } from 'react'
import { cn } from './lib/cn.js'

export type FieldProps = {
  label: string
  hint?: string
  error?: string
  htmlFor?: string
  children: ReactNode
  className?: string
}

export function Field({ label, hint, error, htmlFor, children, className }: FieldProps) {
  return (
    <label className={cn('bn-field', className)} htmlFor={htmlFor}>
      <span className="bn-field-label">{label}</span>
      {children}
      {error ? <p className="bn-field-error">{error}</p> : null}
      {!error && hint ? <p className="bn-field-hint">{hint}</p> : null}
    </label>
  )
}
