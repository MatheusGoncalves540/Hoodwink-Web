import { Controller, Post, Body, Res, HttpCode, HttpStatus } from "@nestjs/common";
import { Response } from "express"; // Importa o tipo de resposta do Express
import { RegisterService } from "../services/registerService";
import { AuthService } from "src/services/authService";
import { makeResponse } from "src/utils/makeResponse";
import { error } from "console";

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
  async register(@Body() body: RegisterBody, @Res({ passthrough: true }) res: Response) {
    const { nickname, email, password } = body;

    const validation = await this.RegisterService.validateRegisterInfo(
      nickname,
      email,
      password
    );
    if (!validation.success) {
      if (validation.message) makeResponse(res, HttpStatus.CONFLICT, validation.message, !validation.success);
      return
    }

    const hashedPassword = await this.AuthService.hashPassword(password);
    const newUser = { nickname, email, password: hashedPassword };

    const jwtToken = await this.RegisterService.registerUser(newUser);
    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      maxAge: Number(process.env.JWT_EXPIRATION_MS),
      sameSite: "strict",
    });

    makeResponse(res, HttpStatus.CREATED, "Usuário criado com sucesso!", !validation.success);
    return
  }
}
