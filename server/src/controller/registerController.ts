import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus
} from "@nestjs/common";
import { Response } from "express";
import { RegisterService } from "../services/registerService";
import { AuthService } from "src/services/authService";
import { makeResponse } from "src/utils/makeResponse";
import { sendCookies } from "src/utils/sendCookies";
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
  async register(
    @Body() body: RegisterBody,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const { nickname, email, password } = body;

      const validation = await this.RegisterService.validateRegisterInfo(
        nickname,
        email,
        password
      );
      if (!validation.success) {
        if (validation.message)
          makeResponse(
            res,
            HttpStatus.CONFLICT,
            validation.message,
            !validation.success
          );
        return;
      }

      const hashedPassword = await this.AuthService.hashPassword(password);
      const newUser = { nickname, email, password: hashedPassword };

      const jwtToken = await this.RegisterService.registerUser(res, newUser);

      if (typeof jwtToken !== "string") return;

      sendCookies(res, jwtToken);

      makeResponse(
        res,
        HttpStatus.CREATED,
        "Conta criada com sucesso!",
        !validation.success
      );
      return;
    } catch (error) {
      console.error(error);
      makeResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao realizar o cadastro", true);
      return;
    }

  }
}
