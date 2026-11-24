import { describe, expect, it } from 'vitest'
import { createTenantDatabaseName } from './tenant-name.js'

describe('createTenantDatabaseName', () => {
  it('builds a stable bn_ name under 63 characters', () => {
    const name = createTenantDatabaseName('550e8400-e29b-41d4-a716-446655440000')
    expect(name.startsWith('bn_')).toBe(true)
    expect(name.length).toBeLessThanOrEqual(63)
    expect(createTenantDatabaseName('550e8400-e29b-41d4-a716-446655440000')).toBe(name)
  })
})
