import { Response } from "express";

/**
 * Limpa os cookies do cliente contendo o token JWT e os dados do usuário decodificados.
 *
 * @param {Response} res - O objeto de resposta do Express.
 */
export async function clearCookies(res: Response) {
  res.clearCookie("jwt", {
    httpOnly: true,
    maxAge: Number(process.env.JWT_EXPIRATION_MS),
    sameSite: "strict",
  });

  res.clearCookie("userData", {
    httpOnly: false,
    sameSite: "strict",
  });
}
