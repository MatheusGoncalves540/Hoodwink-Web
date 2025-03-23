import { Module } from "@nestjs/common";
import { DatabaseModule } from "./modules/database";
import { RegisterModule } from "./modules/register";
@Module({
  imports: [DatabaseModule, RegisterModule],
  controllers: [],
  providers: [],
})
export class HoodwinkModule { }
