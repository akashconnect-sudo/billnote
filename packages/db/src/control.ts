import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/control/client.js'

let client: PrismaClient | null = null

export function getControlDb(databaseUrl = process.env.DATABASE_URL): PrismaClient {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }
  if (!client) {
    const adapter = new PrismaPg({ connectionString: databaseUrl })
    client = new PrismaClient({ adapter })
  }
  return client
}

export async function disconnectControlDb(): Promise<void> {
  if (client) {
    await client.$disconnect()
    client = null
  }
}

export type { PrismaClient }
export { Prisma } from '../generated/control/client.js'
