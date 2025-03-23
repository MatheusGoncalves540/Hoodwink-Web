import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

if (!process.env.PG_HOST || !process.env.PG_USER || !process.env.PG_PASS || !process.env.PG_NAME) {
  throw new Error('Missing database configuration in environment variables.');
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
  ],
})
export class DatabaseModule { }
