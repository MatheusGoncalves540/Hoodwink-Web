import { Controller, Post, Body } from "@nestjs/common";
import { RegisterService } from "../services/registerService";
import { AuthService } from "src/services/authService";
import { make_response, ResponseData } from "src/utils/makeResponse";

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
  ) { }

  @Post("/register")
  async register(@Body() body: RegisterBody): Promise<ResponseData> {
    const nickname = body.nickname;
    const email = body.email;
    const password = body.password;

    const validation = await this.RegisterService.validateRegisterInfo(nickname, email, password)
    if (!validation.success) {
      if (validation.message) return make_response("error", validation.message);
    }

    const hashedPassword = await this.AuthService.hashPassword(password)
    const newUser = { nickname, email, password: hashedPassword };
    const jwtToken = this.RegisterService.registerUser(newUser)
    return make_response("success", "Usuário Criado", { jwtToken: jwtToken });
  }
}
