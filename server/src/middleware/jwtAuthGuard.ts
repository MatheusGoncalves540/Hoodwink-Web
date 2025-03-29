import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../services/authService';
import { makeResponse } from 'src/utils/makeResponse';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const token: string | null = req.cookies?.jwt || null;

        if (!token) {
            makeResponse(res, HttpStatus.UNAUTHORIZED, 'Faça login para continuar', true);
            return false;
        }

        try {
            req.user = this.authService.validateToken(token);
            return true;
        } catch (error) {
            makeResponse(res, HttpStatus.UNAUTHORIZED, 'Faça login para continuar', true);
            return true;
        }
    }
}


