'use client'

import type { ComponentType, SVGProps } from 'react'
import { cn } from './lib/cn.js'

export type PhosphorIcon = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string; weight?: 'regular' | 'duotone' | 'bold' | 'fill' }
>

export type IconProps = {
  icon: PhosphorIcon
  size?: number
  label?: string
  active?: boolean
  className?: string
}

/**
 * Phosphor wrapper: regular by default, duotone when active/hovered via CSS parent.
 * Pass icons from `@phosphor-icons/react` at call sites so tree-shaking works.
 */
export function Icon({ icon: Glyph, size = 22, label, active, className }: IconProps) {
  return (
    <span
      className={cn('bn-icon-wrap', active && 'bn-icon-active', className)}
      style={{ display: 'inline-flex', lineHeight: 0 }}
    >
      <Glyph
        size={size}
        weight={active ? 'duotone' : 'regular'}
        aria-hidden={label ? undefined : true}
        aria-label={label}
      />
    </span>
  )
}
