import { describe, expect, it } from 'vitest'
import { colors, motion, radii, typeScale, typography } from './index.js'

describe('Paper & Ink tokens', () => {
  it('exposes light paper background and emerald brand', () => {
    expect(colors.light.bg).toBe('#FAF7F2')
    expect(colors.light.brand).toBe('#10A56B')
    expect(colors.dark.bg).toBe('#0F1412')
  })

  it('uses Poppins as the sans family token', () => {
    expect(typography.fontSans.toLowerCase()).toContain('poppins')
  })

  it('has the motion kit durations', () => {
    expect(motion.durationFastMs).toBe(120)
    expect(motion.durationBaseMs).toBe(200)
    expect(motion.durationSlowMs).toBe(320)
  })

  it('uses 12/16/24 radii', () => {
    expect(radii.sm).toBe(12)
    expect(radii.md).toBe(16)
    expect(radii.lg).toBe(24)
  })

  it('includes the type scale', () => {
    expect(typeScale.base).toBe(16)
    expect(typeScale['4xl']).toBe(36)
  })
})
