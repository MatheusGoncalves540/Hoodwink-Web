// refresh-token.middleware.ts
import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { AuthService } from "src/services/authService";
import { makeResponse } from "src/utils/makeResponse";
import { sendCookies } from "src/utils/sendCookies";

export interface decodedToken {
  id: string;
  nickname: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.jwt;

    if (!token) {
      return next();
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodedToken["iat"]) return next();
      if (!decodedToken["exp"]) return next();

      const tokenAge = dayjs().diff(dayjs(decodedToken["iat"] * 1000), "hour");

      if (tokenAge > 4) {
        const newToken = this.authService.generateToken(decodedToken);

        sendCookies(res, newToken);

        req.token = decodedToken;
      }

      if (decodedToken["exp"] * 1000 < Date.now()) {
        makeResponse(
          res,
          HttpStatus.UNAUTHORIZED,
          "Sessão expirada. Faça login novamente.",
          true
        );
        return;
      }

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        makeResponse(
          res,
          HttpStatus.UNAUTHORIZED,
          "Sessão expirada. Faça login novamente.",
          true
        );
        return;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        makeResponse(
          res,
          HttpStatus.UNAUTHORIZED,
          "Sessão inválida. Faça login novamente.",
          true
        );
        return;
      }

      next();
    }
  }
}
