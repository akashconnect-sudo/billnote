'use client'

import { cn } from './lib/cn.js'

export type SkeletonProps = {
  width?: string | number
  height?: string | number
  className?: string
  rounded?: boolean
}

export function Skeleton({ width = '100%', height = 16, className, rounded }: SkeletonProps) {
  return (
    <div
      className={cn('bn-skeleton', className)}
      style={{
        width,
        height,
        borderRadius: rounded ? 999 : undefined,
      }}
      aria-hidden="true"
    />
  )
}
