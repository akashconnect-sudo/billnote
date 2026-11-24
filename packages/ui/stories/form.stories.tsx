import type { Meta, StoryObj } from '@storybook/react'
import { Field } from '../src/field.js'
import { Input } from '../src/input.js'
import { Button } from '../src/button.js'
import { EmptyState } from '../src/empty-state.js'
import { Skeleton } from '../src/skeleton.js'
import { Table, THead, TBody, TR, TH, TD } from '../src/table.js'
import { StampBadge } from '../src/stamp-badge.js'

const meta: Meta = { title: 'Paper & Ink/Forms & Data' }
export default meta

export const FieldStates: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 14, width: 320 }}>
      <Field label="Sale price" hint="Amount the customer pays">
        <Input placeholder="60.00" />
      </Field>
      <Field label="GSTIN" error="Enter a valid 15-character GSTIN">
        <Input invalid defaultValue="bad" />
      </Field>
      <Button>Save item</Button>
    </div>
  ),
}

export const Stamps: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <StampBadge status="paid" animate />
      <StampBadge status="partial" />
      <StampBadge status="overdue" />
      <StampBadge status="draft" />
      <StampBadge status="returned" />
    </div>
  ),
}

export const DataTable: StoryObj = {
  render: () => (
    <div style={{ width: 480 }}>
      <Table>
        <THead>
          <TR>
            <TH>Bill</TH>
            <TH>Status</TH>
            <TH>Amount</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>BOS/0001</TD>
            <TD>
              <StampBadge status="paid" />
            </TD>
            <TD>₹120.00</TD>
          </TR>
          <TR>
            <TD>BOS/0002</TD>
            <TD>
              <StampBadge status="overdue" />
            </TD>
            <TD>₹540.00</TD>
          </TR>
        </TBody>
      </Table>
    </div>
  ),
}

export const Loading: StoryObj = {
  render: () => (
    <div style={{ width: 280, display: 'grid', gap: 10 }}>
      <Skeleton height={20} />
      <Skeleton height={48} />
      <Skeleton height={14} width="60%" />
    </div>
  ),
}

export const Empty: StoryObj = {
  render: () => (
    <EmptyState
      title="No bills yet"
      body="Make your first sale from the Bill screen."
      action={<Button>New bill</Button>}
    />
  ),
}
