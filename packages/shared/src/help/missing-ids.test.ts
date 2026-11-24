import { describe, expect, it } from 'vitest'
import { helpEn, type HelpId } from './en.js'

const HELP_ID_PATTERN = /^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/

describe('help catalog', () => {
  it('has at least the Phase 1 starter keys', () => {
    const keys = Object.keys(helpEn)
    expect(keys.length).toBeGreaterThanOrEqual(20)
    expect(helpEn['dashboard.todaySales']).toMatch(/today/i)
    expect(helpEn['pos.scan']).toMatch(/barcode/i)
  })

  it('uses dotted keys and short plain-English tips', () => {
    for (const [id, text] of Object.entries(helpEn) as Array<[HelpId, string]>) {
      expect(id).toMatch(HELP_ID_PATTERN)
      expect(text.trim().length).toBeGreaterThan(8)
      const words = text.trim().split(/\s+/).length
      expect(words).toBeLessThanOrEqual(28)
    }
  })

  it('has unique tip text for dashboard cards', () => {
    const dashboardTips = Object.entries(helpEn)
      .filter(([id]) => id.startsWith('dashboard.'))
      .map(([, text]) => text)
    expect(new Set(dashboardTips).size).toBe(dashboardTips.length)
  })
})
