'use client'

import type { InputHTMLAttributes } from 'react'
import { cn } from './lib/cn.js'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export function Input({ className, invalid, ...rest }: InputProps) {
  return (
    <input
      className={cn('bn-input', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
}
