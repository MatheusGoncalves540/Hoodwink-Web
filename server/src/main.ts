import { config } from 'dotenv';
config();
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { HoodwinkModule } from './hoodwinkModule';
import helmet from 'helmet';
const cors = require('cors');

const corsOptions = {
  origin: process.env.REACT_APP_URL,
  credentials: true
};

async function bootstrap() {
  const app = await NestFactory.create(HoodwinkModule);
  app.use(helmet());
  app.use(cookieParser());
  app.use(cors(corsOptions));
  await app.listen(process.env.PORT ?? 2409);
}
bootstrap()
