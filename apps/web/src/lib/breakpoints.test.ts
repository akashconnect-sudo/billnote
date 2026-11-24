import { resolveBreakpoint } from '@billnote/shared'
import { describe, expect, it } from 'vitest'

describe('web breakpoint tokens', () => {
  it('maps widths to the design breakpoints', () => {
    expect(resolveBreakpoint(320)).toBe('xs')
    expect(resolveBreakpoint(390)).toBe('sm')
    expect(resolveBreakpoint(768)).toBe('md')
    expect(resolveBreakpoint(1280)).toBe('lg')
    expect(resolveBreakpoint(1600)).toBe('xl')
  })
})
