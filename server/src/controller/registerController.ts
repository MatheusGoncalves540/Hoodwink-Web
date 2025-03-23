import { Controller, Post, Body } from "@nestjs/common";
import { RegisterService } from "../services/registerService";
import { RegisterValidations } from "src/validations/registerValidations";
import { AuthService } from "src/services/authService";

interface RegisterBody {
  nickname: string;
  email: string;
  password: string;
}

@Controller()
export class RegisterController {
  constructor(
    private readonly RegisterService: RegisterService,
    private readonly AuthService: AuthService
  ) {}

  @Post("/register")
  async register(@Body() body: RegisterBody): Promise<string> {
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

    const hashedPassword = await this.AuthService.hashPassword(password)
    const newUser = { nickname, email, password:hashedPassword };
    return this.RegisterService.registerUser(newUser);
  }
}
