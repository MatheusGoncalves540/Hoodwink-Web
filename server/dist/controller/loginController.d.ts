import { LoginService } from '../services/loginService';
export declare class LoginController {
    private readonly LoginService;
    constructor(LoginService: LoginService);
    register(body: any): string;
}
