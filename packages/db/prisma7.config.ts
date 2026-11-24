import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/control/schema.prisma',
  migrations: {
    path: 'prisma/control/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
