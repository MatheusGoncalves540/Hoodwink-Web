import { Injectable } from "@nestjs/common";
import { UsersService } from "./usersService";
import { User } from "@shared/interfaces/userInterface";
import { AuthService } from "./authService";

interface validationReponse {
  success: boolean
  message?: string
}

@Injectable()
export class RegisterService {
  constructor(private readonly UsersService: UsersService, private readonly AuthService: AuthService) { }

  registerUser(user: User): string {
    try {
      this.UsersService.create(user);

      const jwtToken = this.AuthService.generateToken(user);

      return jwtToken;
    } catch (error) {
      return error.message;
    }
  }

  async validateRegisterInfo(nickname: string, email: string, password: string): Promise<validationReponse> {
    const validations = [
      this.passwordValidation(password, nickname),
      await this.emailValidation(email),
      this.nicknameValidation(nickname)
    ]

    for (const validation of validations) {
      if (!validation.success) return validation;
    }

    return { success: true }
  }

  passwordValidation(password: string, nickname: string): validationReponse {
    if (!password) return { success: false, message: "senha inválida" };
    if (password.length < 8 || password.length > 41) return { success: false, message: "senha inválida" };
    if (password === nickname) return { success: false, message: "senha inválida" };

    return { success: true };
  }

  async emailValidation(email: string): Promise<validationReponse> {
    if (!email) return { success: false, message: "email inválido" };
    if (email.length < 5 || email.length > 41) return { success: false, message: "email inválido" };
    if (!email.includes("@")) return { success: false, message: "email inválido" };

    const alreadyExist = await this.UsersService.findByEmail(email);
    if (alreadyExist) return { success: false, message: "Email já está em uso" };

    return { success: true };
  }

  nicknameValidation(nickname: string): validationReponse {
    if (!nickname) return { success: false, message: "nick inválido" };
    if (nickname.length < 4 || nickname.length > 20) return { success: false, message: "nick inválido" };

    return { success: true };
  }
}
