'use client'

import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from 'react'
import { cn } from './lib/cn.js'

export function Table({ className, ...rest }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="bn-table-wrap">
      <table className={cn('bn-table', className)} {...rest} />
    </div>
  )
}

export function THead({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TR({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={className} {...rest} />
}

export function TH({ className, ...rest }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={className} {...rest} />
}

export function TD({ className, ...rest }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={className} {...rest} />
}
