import { Module } from "@nestjs/common";
import { DatabaseModule } from "./modules/databaseModule";
import { RegisterModule } from "./modules/registerModule";
import { UsersModule } from "./modules/usersModule";
@Module({
  imports: [DatabaseModule, UsersModule, RegisterModule],
  controllers: [],
  providers: [],
})
export class HoodwinkModule { }
