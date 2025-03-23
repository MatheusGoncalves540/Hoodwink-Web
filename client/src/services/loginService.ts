import apiServer from "../api/api";

export class LoginService {
  constructor() {}

  static async register(nickname: string, email: string, password: string) {
    const response = await apiServer.post("/register", {nickname ,email, password });
    const token = response.data.jwtToken;
    document.cookie = `jwt=${token}; path=/; max-age=${60 * 60}`; // Armazenando o token no cookie com validade de 1 hora
    return response.data;
  }
}
