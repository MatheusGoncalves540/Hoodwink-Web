import { Controller, Post, Body } from "@nestjs/common";
import { RegisterService } from "../services/registerService";
import { RegisterValidations } from "src/validations/registerValidations";

interface RegisterBody {
  nickname: string;
  email: string;
  password: string;
}

@Controller()
export class RegisterController {
  constructor(private readonly LoginService: RegisterService) {}

  @Post("/register")
  register(@Body() body: RegisterBody): string {
    const nickname = body.nickname;
    const email = body.email;
    const password = body.password;

    if (
      !RegisterValidations.passwordValidation(password, nickname) ||
      !RegisterValidations.emailValidation(email) ||
      !RegisterValidations.nicknameValidation(nickname)
    ) {
      return "Informações inválidas";
    }

    return this.LoginService.getHello();
  }
}
