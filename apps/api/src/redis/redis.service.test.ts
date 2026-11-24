import { describe, expect, it } from 'vitest'
import { RedisService } from './redis.service.js'

const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379'

describe('RedisService', () => {
  it('pings the running Redis and stores JSON with TTL', async () => {
    process.env.REDIS_URL = redisUrl
    const redis = new RedisService()
    expect(await redis.ping()).toBe(true)

    const key = `bn:test:${Date.now()}`
    await redis.setJson(key, { hello: 'billnote' }, 30)
    const value = await redis.getJson<{ hello: string }>(key)
    expect(value?.hello).toBe('billnote')

    const rate = await redis.hitRateLimit(`bn:test:rl:${Date.now()}`, 3, 60)
    expect(rate.allowed).toBe(true)
    expect(rate.remaining).toBe(2)

    await redis.del(key)
    await redis.onModuleDestroy()
  })
})
