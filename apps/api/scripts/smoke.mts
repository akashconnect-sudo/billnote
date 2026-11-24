import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/app.module.js'

const app = await NestFactory.create(AppModule, { logger: false })
await app.listen(4010, '127.0.0.1')

const live = await fetch('http://127.0.0.1:4010/health/live').then((r) => r.json())
const version = await fetch('http://127.0.0.1:4010/app/version').then((r) => r.json())
process.stdout.write(`${JSON.stringify({ live, version }, null, 2)}\n`)

await app.close()
