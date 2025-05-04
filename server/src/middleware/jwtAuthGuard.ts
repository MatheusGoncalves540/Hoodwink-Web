import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../services/authService';
import { makeResponse } from 'src/utils/makeResponse';
import { clearCookies } from 'src/utils/clearCookies';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const token: string | null = req.cookies?.jwt || null;

        if (!token) {
            clearCookies(res);
            makeResponse(res, HttpStatus.UNAUTHORIZED, 'Faça login para continuar', true);
            return false;
        }

        try {
            req.user = this.authService.validateToken(token);
            return true;
        } catch (error) {
            clearCookies(res);
            makeResponse(res, HttpStatus.UNAUTHORIZED, 'Faça login para continuar', true);
            return true;
        }
    }
}


