'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './lib/cn.js'

export type CardProps = HTMLAttributes<HTMLElement> & {
  interactive?: boolean
  receiptEdge?: boolean
  as?: 'article' | 'div' | 'section'
  children: ReactNode
}

export function Card({
  interactive,
  receiptEdge,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        'bn-card',
        interactive && 'bn-card-interactive',
        receiptEdge && 'bn-card-receipt',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
