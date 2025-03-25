import { Module } from "@nestjs/common";
import { LoginController } from "src/controller/loginController";
import { LoginService } from "src/services/loginService";
import { UsersModule } from "./usersModule";
import { AuthService } from "src/services/authService";

@Module({
  imports: [UsersModule],
  controllers: [LoginController],
  providers: [LoginService, AuthService],
})
export class LoginModule {}
