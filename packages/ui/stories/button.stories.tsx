import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../src/button.js'

const meta: Meta<typeof Button> = {
  title: 'Paper & Ink/Button',
  component: Button,
  args: { children: 'Save bill' },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Loading: Story = { args: { loading: true } }
export const Block: Story = { args: { block: true } }
