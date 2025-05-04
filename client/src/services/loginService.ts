import apiServer from "../api/api";

export class LoginService {
  static async login(email: string, password: string) {
    try {
      const response = await apiServer.post("/login", {email, password });
      return response.data;
    } catch (error) {
      return error
    }
  }
}
