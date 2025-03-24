import apiServer from "../api/api";

export class LoginService {
  constructor() { }

  static async register(nickname: string, email: string, password: string) {
    const response = await apiServer.post("/register", { nickname, email, password });
    const token = response.data.jwtToken;
    document.cookie = `jwt=${token}`;
    return response.data;
  }
}
