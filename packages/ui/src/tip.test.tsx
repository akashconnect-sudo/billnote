import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tip } from './tip.js'

describe('Tip', () => {
  it('renders children with a help catalog id', () => {
    render(
      <Tip id="dashboard.todaySales">
        <button type="button">Today's sales</button>
      </Tip>,
    )
    const tipHost = document.querySelector('[data-help-id="dashboard.todaySales"]')
    expect(tipHost).not.toBeNull()
    expect(screen.getByRole('button', { name: /today/i })).toBeTruthy()
  })
})
