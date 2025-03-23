import { Module } from "@nestjs/common";
import { RegisterController } from "src/controller/registerController";
import { RegisterService } from "src/services/registerService";
import { UsersModule } from "./usersModule";
import { AuthService } from "src/services/authService";

@Module({
  imports: [UsersModule],
  controllers: [RegisterController],
  providers: [RegisterService, AuthService],
})
export class RegisterModule {}
