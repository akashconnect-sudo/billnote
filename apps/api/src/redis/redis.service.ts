import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis

  constructor() {
    const url = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379'
    this.client = new Redis(url, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: true,
    })
  }

  get raw(): Redis {
    return this.client
  }

  async connect(): Promise<void> {
    if (this.client.status === 'wait') {
      await this.client.connect()
    }
  }

  async ping(): Promise<boolean> {
    await this.connect()
    const result = await this.client.ping()
    return result === 'PONG'
  }

  async getJson<T>(key: string): Promise<T | null> {
    await this.connect()
    const value = await this.client.get(key)
    if (!value) return null
    return JSON.parse(value) as T
  }

  async setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.connect()
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  }

  async del(key: string): Promise<void> {
    await this.connect()
    await this.client.del(key)
  }

  async hitRateLimit(
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<{
    allowed: boolean
    remaining: number
    retryAfterSeconds: number
  }> {
    await this.connect()
    const count = await this.client.incr(key)
    if (count === 1) {
      await this.client.expire(key, windowSeconds)
    }
    const ttl = await this.client.ttl(key)
    const remaining = Math.max(0, limit - count)
    return {
      allowed: count <= limit,
      remaining,
      retryAfterSeconds: ttl > 0 ? ttl : windowSeconds,
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.status !== 'end') {
      await this.client.quit()
    }
  }
}
