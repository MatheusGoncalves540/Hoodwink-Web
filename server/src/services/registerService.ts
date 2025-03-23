import { Injectable } from "@nestjs/common";
import { UsersService } from "./usersService";
import { User } from "../interfaces/userInterface";

@Injectable()
export class RegisterService {
  constructor(private readonly UsersService: UsersService) {}

  registerUser(User: User): string {
    try {
      this.UsersService.create(User);
      return "Usuário Criado";
    } catch (error) {
      return error.message;
    }
  }
}
