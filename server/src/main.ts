import { config } from 'dotenv';
config();
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { HoodwinkModule } from './hoodwinkModule';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
const cors = require('cors');

// Configuração de Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 180, // Limite de requisições por IP
  message: 'Muitas requisições feitas, tente novamente mais tarde',
});

// Configuração do CORS
const corsOptions = {
  origin: process.env.REACT_APP_URL,
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(HoodwinkModule);
  app.use(limiter);
  app.use(helmet());
  app.use(cookieParser());
  app.use(cors(corsOptions));
  await app.listen(process.env.PORT ?? 2409);
}

bootstrap();
