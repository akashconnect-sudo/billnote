import { describe, expect, it } from 'vitest'
import { assertBizPk, keys } from './keys.js'

describe('keys', () => {
  it('builds biz partition keys', () => {
    expect(keys.bizPk('abc')).toBe('BIZ#abc')
    expect(() => assertBizPk('BIZ#abc')).not.toThrow()
    expect(() => assertBizPk('USER#1')).toThrow()
  })
})
