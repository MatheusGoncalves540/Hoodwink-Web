import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';

if (!process.env.PG_HOST || !process.env.PG_USER || !process.env.PG_PASS || !process.env.PG_NAME) {
  throw new Error('Configuração de banco de dados ausente nas variáveis de ambiente.');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: 5432,
      username: `${process.env.PG_USER}`,
      password: `${process.env.PG_PASS}`,
      database: `${process.env.PG_NAME}`,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
      options: {
        password: `${process.env.REDIS_PASS}`
      }
    })
  ],
})
export class DatabaseModule { }
