import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module.js'
import { getEnv } from './env.js'

async function bootstrap() {
  const env = getEnv()
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  app.use(cookieParser())
  app.enableCors({
    origin: env.WEB_ORIGIN,
    credentials: true,
  })

  if (env.EXPOSE_DOCS) {
    const config = new DocumentBuilder()
      .setTitle('BILLNOTE API')
      .setDescription('Phase 2 API: auth, businesses, Redis-backed cache and queues.')
      .setVersion('0.2.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen(env.API_PORT, env.API_HOST)
  process.stdout.write(`BILLNOTE API listening on http://${env.API_HOST}:${env.API_PORT}\n`)
  process.stdout.write(`Redis: ${process.env.REDIS_URL}\n`)
}

void bootstrap()
