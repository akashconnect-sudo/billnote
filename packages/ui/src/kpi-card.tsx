'use client'

import type { HelpId } from '@billnote/shared'
import type { ReactNode } from 'react'
import { Card } from './card.js'
import { CountUp } from './count-up.js'
import { Sparkline } from './sparkline.js'
import { Tip } from './tip.js'
import { cn } from './lib/cn.js'

export type KpiCardProps = {
  label: string
  value: string | number
  /** When numeric, animates count-up. Pass paise or plain numbers. */
  numericValue?: number
  formatNumeric?: (n: number) => string
  deltaPercent?: number
  subtitle?: string
  sparkline?: number[]
  icon?: ReactNode
  helpId: HelpId
  tone?: 'default' | 'good' | 'attention' | 'urgent'
  onClick?: () => void
  className?: string
}

export function KpiCard({
  label,
  value,
  numericValue,
  formatNumeric,
  deltaPercent,
  subtitle,
  sparkline,
  icon,
  helpId,
  tone = 'default',
  onClick,
  className,
}: KpiCardProps) {
  const deltaClass =
    deltaPercent === undefined
      ? ''
      : deltaPercent >= 0
        ? 'bn-kpi-delta-up'
        : 'bn-kpi-delta-down'

  return (
    <Tip id={helpId} showInfoIcon className="bn-tip-block">
      <Card
        as="article"
        interactive={Boolean(onClick)}
        className={cn('bn-kpi', className)}
        data-widget={helpId}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div className="bn-kpi-label">{label}</div>
          {icon}
        </div>
        <div
          className="bn-kpi-value"
          style={{
            color:
              tone === 'good'
                ? 'var(--bn-success)'
                : tone === 'attention'
                  ? 'var(--bn-accent)'
                  : tone === 'urgent'
                    ? 'var(--bn-danger)'
                    : undefined,
          }}
        >
          {numericValue !== undefined ? (
            <CountUp value={numericValue} format={formatNumeric} />
          ) : (
            value
          )}
        </div>
        {deltaPercent !== undefined ? (
          <div className={cn('bn-kpi-delta', deltaClass)}>
            {deltaPercent >= 0 ? '▲' : '▼'} {Math.abs(deltaPercent).toFixed(1)}% vs yesterday
          </div>
        ) : null}
        {sparkline && sparkline.length > 1 ? <Sparkline values={sparkline} /> : null}
        {subtitle ? <p className="bn-kpi-sub">{subtitle}</p> : null}
      </Card>
    </Tip>
  )
}
