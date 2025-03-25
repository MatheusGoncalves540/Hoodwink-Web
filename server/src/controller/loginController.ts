import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { LoginService } from "../services/loginService";
import { AuthService } from "src/services/authService";
import { makeResponse } from "src/utils/makeResponse";

interface LoginBody {
  email: string;
  password: string;
}
@Controller()
export class LoginController {
  constructor(
    private readonly LoginService: LoginService,
    private readonly AuthService: AuthService
  ) { }

  @Post("/login")
  async login(@Body() body: LoginBody, @Res({ passthrough: true }) res: Response) {
    return
  }
}
