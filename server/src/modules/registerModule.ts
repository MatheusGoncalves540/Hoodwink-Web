import { Module } from "@nestjs/common";
import { RegisterController } from "src/controller/registerController";
import { RegisterService } from "src/services/registerService";

@Module({
  imports: [],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule { }
