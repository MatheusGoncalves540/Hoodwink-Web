import { Module } from "@nestjs/common";
import { LoginController } from "./controller/registerController";
import { RegisterService } from "./services/registerService";

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [RegisterService],
})
export class HoodwinkModule {}
