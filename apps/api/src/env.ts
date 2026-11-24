import { config as loadDotenv } from 'dotenv'
import { resolve } from 'node:path'
import { loadEnv, type AppEnv } from '@billnote/config/env'

loadDotenv({ path: resolve(process.cwd(), '../../.env') })
loadDotenv({ path: resolve(process.cwd(), '.env') })

let cached: AppEnv | null = null

export function getEnv(): AppEnv {
  if (!cached) {
    cached = loadEnv(process.env)
  }
  return cached
}

export type { AppEnv }
