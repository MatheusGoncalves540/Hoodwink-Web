import { Injectable } from "@nestjs/common";
import { UsersService } from "./usersService";
import { User } from "../interfaces/userInterface";
import { AuthService } from "./authService";

@Injectable()
export class LoginService {
  constructor(private readonly UsersService: UsersService, private readonly AuthService: AuthService) { }

  loginUser(user: Partial<User>): string {
    try {
      // this.UsersService.create(user);

      const jwtToken = this.AuthService.generateToken(user);

      return jwtToken;
    } catch (error) {
      return error.message;
    }
  }
}
