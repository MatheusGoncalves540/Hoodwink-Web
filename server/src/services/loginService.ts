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
      if (!user.email) return makeResponse(res, HttpStatus.BAD_REQUEST, "Email não recebido", true);

      const loggingUser = await this.UsersService.findByEmail(user.email);

      if (!loggingUser) return makeResponse(res, HttpStatus.NOT_FOUND, "Usuário não encontrado", true, { redirectTo: "/register" });

      const jwtToken = this.AuthService.generateToken(user);

      return jwtToken;
    } catch (error) {
      return error.message;
    }
  }
}
