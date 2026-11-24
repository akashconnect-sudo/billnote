'use client'

import { cn } from './lib/cn.js'

export type StampStatus = 'paid' | 'partial' | 'overdue' | 'draft' | 'returned'

const labels: Record<StampStatus, string> = {
  paid: 'Paid',
  partial: 'Partial',
  overdue: 'Overdue',
  draft: 'Draft',
  returned: 'Returned',
}

export type StampBadgeProps = {
  status: StampStatus
  animate?: boolean
  className?: string
}

export function StampBadge({ status, animate, className }: StampBadgeProps) {
  return (
    <span
      className={cn(
        'bn-stamp',
        `bn-stamp-${status}`,
        animate && status === 'paid' && 'bn-stamp-animate',
        className,
      )}
      data-help-id={
        status === 'paid'
          ? 'status.paid'
          : status === 'partial'
            ? 'status.partial'
            : status === 'overdue'
              ? 'status.overdue'
              : undefined
      }
    >
      {labels[status]}
    </span>
  )
}
