import { Module } from "@nestjs/common";
import { RegisterController } from "./controller/registerController";
import { RegisterService } from "./services/registerService";
import { UsersModule } from "./database/connection";

@Module({
  imports: [UsersModule],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class HoodwinkModule {}
