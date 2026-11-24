import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '../src/card.js'
import { StampBadge } from '../src/stamp-badge.js'
import { KpiCard } from '../src/kpi-card.js'

const meta: Meta = {
  title: 'Paper & Ink/Cards',
}

export default meta

export const Surface: StoryObj = {
  render: () => (
    <Card style={{ width: 280 }}>
      <strong>Shop card</strong>
      <p style={{ margin: '8px 0 0', color: 'var(--bn-muted)', fontSize: 14 }}>
        Soft shadow, hairline border.
      </p>
    </Card>
  ),
}

export const Interactive: StoryObj = {
  render: () => (
    <Card interactive style={{ width: 280 }}>
      Hover to lift
    </Card>
  ),
}

export const ReceiptEdge: StoryObj = {
  render: () => (
    <Card receiptEdge style={{ width: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>Bill #BOS/2627/000001</strong>
        <StampBadge status="paid" animate />
      </div>
      <div style={{ marginTop: 12, fontVariantNumeric: 'tabular-nums' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Parle-G</span>
          <span style={{ flex: 1, borderBottom: '1px dotted var(--bn-line)', margin: '0 8px 6px' }} />
          <span>₹20.00</span>
        </div>
      </div>
    </Card>
  ),
}

export const Kpi: StoryObj = {
  render: () => (
    <KpiCard
      helpId="dashboard.todaySales"
      label="Today's sales"
      value="₹0"
      numericValue={18450}
      formatNumeric={(n) =>
        `₹${Math.round(n / 100).toLocaleString('en-IN')}.${String(Math.round(n % 100)).padStart(2, '0')}`
      }
      deltaPercent={12.4}
      sparkline={[10, 14, 12, 18, 22, 19, 28]}
      subtitle="Bills made today"
      tone="good"
    />
  ),
}
