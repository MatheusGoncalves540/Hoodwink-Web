import { Response } from "express";
import jwt from "jsonwebtoken";
import { decodedToken } from "src/middleware/refreshTokenMiddleware";

/**
 * Envia cookies para o cliente contendo o token JWT e os dados do usuário decodificados.
 *
 * @param {Response} res - O objeto de resposta do Express.
 * @param {string} token - O token JWT a ser armazenado nos cookies.
 */
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
