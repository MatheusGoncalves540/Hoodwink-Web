import apiServer from "../api/api";

export class RegisterService {
  static async register(nickname: string, email: string, password: string) {
    try {
      const response = await apiServer.post("/register", { nickname, email, password });
      return response.data;
    } catch (error : any) {
      return error.response.data
    }
  }
}
