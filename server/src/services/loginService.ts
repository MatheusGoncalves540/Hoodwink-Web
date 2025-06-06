import { HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "./usersService";
import { Response } from "express";
import { User } from "../interfaces/userInterface";
import { AuthService } from "./authService";
import { makeResponse } from "src/utils/makeResponse";

@Injectable()
export class LoginService {
  constructor(private readonly UsersService: UsersService, private readonly AuthService: AuthService) { }

  async loginUser(res: Response, user: Partial<User>): Promise<string | Response> {
    try {
      if (!user.email || !user.password) return makeResponse(res, HttpStatus.BAD_REQUEST, "Credenciais não recebido", true);

      const loggingUser = await this.UsersService.findByEmail(user.email);

      if (!loggingUser) return makeResponse(res, HttpStatus.FORBIDDEN, "Credenciais incorretas", true);

      if (!await this.AuthService.validatePassword(user.password, loggingUser.password)) return makeResponse(res, HttpStatus.FORBIDDEN, "Credenciais incorretas", true);

      const jwtToken = this.AuthService.generateToken(loggingUser);

      if (!jwtToken) return makeResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao realizar a autenticação", true);

      return jwtToken;
    } catch (error) {
      console.error(error.message);
      return makeResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao realizar o cadastro", true);
    }
  }
}
