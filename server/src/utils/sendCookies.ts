import { Response } from "express";
import jwt from "jsonwebtoken";
import { decodedToken } from "src/middleware/refreshTokenMiddleware";

export async function sendCookies(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: Number(process.env.JWT_EXPIRATION_MS),
    sameSite: "strict",
  });

  const decodedToken: decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  res.cookie("userData", JSON.stringify(decodedToken), {
    httpOnly: false,
    sameSite: "strict",
  });
}
