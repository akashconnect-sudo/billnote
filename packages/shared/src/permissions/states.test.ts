import { describe, expect, it } from 'vitest'
import {
  canRequestAgain,
  isUsable,
  needsSettings,
  nextStateAfterOsResult,
} from './states.js'

describe('permission states', () => {
  it('knows when the OS can be asked again', () => {
    expect(canRequestAgain('not_determined')).toBe(true)
    expect(canRequestAgain('denied')).toBe(true)
    expect(canRequestAgain('skipped')).toBe(true)
    expect(canRequestAgain('blocked')).toBe(false)
    expect(canRequestAgain('granted')).toBe(false)
  })

  it('routes blocked permissions to Settings', () => {
    expect(needsSettings('blocked')).toBe(true)
    expect(needsSettings('restricted')).toBe(true)
    expect(needsSettings('denied')).toBe(false)
  })

  it('treats limited access as usable', () => {
    expect(isUsable('granted')).toBe(true)
    expect(isUsable('limited')).toBe(true)
    expect(isUsable('denied')).toBe(false)
  })

  it('updates state from OS results without clearing restricted', () => {
    expect(nextStateAfterOsResult('not_determined', 'granted')).toBe('granted')
    expect(nextStateAfterOsResult('denied', 'blocked')).toBe('blocked')
    expect(nextStateAfterOsResult('restricted', 'granted')).toBe('restricted')
  })
})
