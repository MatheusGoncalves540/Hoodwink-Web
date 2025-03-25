import apiServer from "../api/api";

export class RegisterService {
  constructor() { }

  static async register(nickname: string, email: string, password: string) {
    try {
      const response = await apiServer.post("/register", { nickname, email, password });
      const token = response.data.jwtToken;
      document.cookie = `jwt=${token}`;
      return response.data;
    } catch (error) {
      return error
    }
  }
}
