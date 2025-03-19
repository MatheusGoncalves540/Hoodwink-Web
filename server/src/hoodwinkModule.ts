import { Module } from "@nestjs/common";
import { RegisterController } from "./controller/registerController";
import { RegisterService } from "./services/registerService";

@Module({
  imports: [],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class HoodwinkModule {}
