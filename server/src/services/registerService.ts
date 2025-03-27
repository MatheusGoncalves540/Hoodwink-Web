import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UsersService } from "./usersService";
import { User } from "../interfaces/userInterface";
import { AuthService } from "./authService";
import wordsBlacklist from '../rulesInJson/wordsBlacklist.json'

interface validationReponse {
  success: boolean
  message?: string
}

@Injectable()
export class RegisterService {
  constructor(private readonly UsersService: UsersService, private readonly AuthService: AuthService) { }

  async registerUser(user: User): Promise<string> {
    try {
      const newUser = await this.UsersService.create(user);

      if (!newUser) throw new InternalServerErrorException("Erro interno");

      const jwtToken = this.AuthService.generateToken(newUser);

      return jwtToken;
    } catch (error) {
      return error.message;
    }
  }

  async validateRegisterInfo(nickname: string, email: string, password: string): Promise<validationReponse> {
    const validations = [
      this.passwordValidation(password, nickname),
      await this.emailValidation(email),
      await this.nicknameValidation(nickname)
    ]

    for (const validation of validations) {
      if (!validation.success) return validation;
    }

    return { success: true }
  }

  passwordValidation(password: string, nickname: string): validationReponse {
    if (!password) return { success: false, message: "Senha inválida" };
    if (password.length < 8 || password.length > 42) return { success: false, message: "Senha inválida" };
    if (password === nickname) return { success: false, message: "Senha inválida" };

    return { success: true };
  }

  async emailValidation(email: string): Promise<validationReponse> {
    if (!email) return { success: false, message: "Email inválido" };
    if (email.length < 5 || email.length > 42) return { success: false, message: "Email inválido" };
    if (!email.includes("@")) return { success: false, message: "Email inválido" };

    const alreadyExist = await this.UsersService.findByEmail(email);
    if (alreadyExist) return { success: false, message: "Email já está em uso" };

    return { success: true };
  }

  async nicknameValidation(nickname: string): Promise<validationReponse> {
    if (!nickname) return { success: false, message: "Nickname inválido" };
    if (nickname.length < 3 || nickname.length > 22) return { success: false, message: "Nickname inválido" };

    for (const badWord of wordsBlacklist.nickname) {
      if (nickname.includes(badWord)) return { success: false, message: "Nickname inválido" };
    }

    const alreadyExist = await this.UsersService.findByNick(nickname);
    if (alreadyExist) return { success: false, message: "Nickname já está em uso" };

    return { success: true };
  }
}
