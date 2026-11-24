import { describe, expect, it, vi } from 'vitest'
import { HealthController } from './health.controller.js'
import type { RedisService } from '../redis/redis.service.js'

describe('HealthController', () => {
  it('returns live ok', () => {
    const redis = { ping: vi.fn() } as unknown as RedisService
    const controller = new HealthController(redis)
    const result = controller.live()
    expect(result.data?.status).toBe('ok')
    expect(result.error).toBeNull()
  })
})
