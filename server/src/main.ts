import { NestFactory } from '@nestjs/core'
import { HoodwinkModule } from './hoodwinkModule'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(HoodwinkModule)
  app.use(helmet())
  await app.listen(process.env.PORT ?? 2409)
}
bootstrap()
