/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { User } from "../interfaces/userInterface";
import { decodedJwtToken } from "src/interfaces/decodedJwtToken";

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  private readonly JWT_EXPIRATION = process.env.JWT_EXPIRATION || "16h";

  generateToken(user: Partial<User>): string | null {
    try {
      if (!user.id || !user.nickname) return null;
      const payload: decodedJwtToken = {
        id: user.id,
        nickname: user.nickname,
      };

      return jwt.sign(payload, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRATION,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  validatePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compare(password, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, 5);
      return hashedPassword;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao registrar Usuário");
    }
  }

  validateToken(token: string): boolean {
    try {
      const validToken = jwt.verify(token, this.JWT_SECRET);
      if (validToken) return true;
      return false;
    } catch {
      return false;
    }
  }
}
