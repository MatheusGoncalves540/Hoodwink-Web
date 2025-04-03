// refresh-token.middleware.ts
import {
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { AuthService } from "src/services/authService";
import { makeResponse } from "src/utils/makeResponse";
import { sendCookies } from "src/utils/sendCookies";
import { clearCookies } from "src/utils/clearCookies";
import { decodedJwtToken } from "src/interfaces/decodedJwtToken";

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.jwt;

      if (!token) {
        return next();
      }

      const JWT_REFRESH_MIDDLEWARE = Number(process.env.JWT_REFRESH_MIDDLEWARE);
      const decodedToken: decodedJwtToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodedToken["iat"]) return next();
      if (!decodedToken["exp"]) return next();

      const tokenAge = dayjs().diff(dayjs(decodedToken["iat"] * 1000), "hour");

      if (tokenAge > JWT_REFRESH_MIDDLEWARE) {
        const newToken = this.authService.generateToken(decodedToken);

        if (newToken) sendCookies(res, newToken);

        req.decodedToken = decodedToken;
      }

      if (decodedToken["exp"] * 1000 < Date.now()) {
        clearCookies(res);
        makeResponse(
          res,
          HttpStatus.UNAUTHORIZED,
          "Sessão expirada. Faça login novamente.",
          true
        );
        return;
      }

      req.decodedToken = decodedToken;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        clearCookies(res);
        makeResponse(
          res,
          HttpStatus.UNAUTHORIZED,
          "Sessão expirada. Faça login novamente.",
          true
        );
        return;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        clearCookies(res);
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
