import type { Preview } from '@storybook/react'
import React from 'react'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'paper',
      values: [
        { name: 'paper', value: '#FAF7F2' },
        { name: 'ink', value: '#0F1412' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="bn-ui-root" data-theme="light" style={{ padding: 24, minWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
}

export default preview
