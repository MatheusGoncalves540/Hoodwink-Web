import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.PG_HOST}`,
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
