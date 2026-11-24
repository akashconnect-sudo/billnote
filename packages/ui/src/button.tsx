'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './lib/cn.js'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'md' | 'sm' | 'icon'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  block,
  loading,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'bn-button',
        variant === 'primary' && 'bn-button-primary',
        variant === 'secondary' && 'bn-button-secondary',
        variant === 'ghost' && 'bn-button-ghost',
        variant === 'danger' && 'bn-button-danger',
        size === 'sm' && 'bn-button-sm',
        size === 'icon' && 'bn-button-icon',
        block && 'bn-button-block',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span aria-hidden="true">…</span> : leftIcon}
      {children}
      {!loading ? rightIcon : null}
    </button>
  )
}
