import { Module } from "@nestjs/common";
import { DatabaseModule } from "./modules/databaseModule";
import { RegisterModule } from "./modules/registerModule";
import { UsersModule } from "./modules/usersModule";
import { LoginModule } from "./modules/loginModule";
@Module({
  imports: [DatabaseModule, UsersModule, RegisterModule, LoginModule],
  controllers: [],
  providers: [],
})
export class HoodwinkModule { }
