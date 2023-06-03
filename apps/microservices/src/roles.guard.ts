import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";
import { AuthService } from "./auth.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private authService: AuthService) {
    }

    async canActivate(context: ExecutionContext) {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            if (!requiredRoles) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const { refreshToken } = req.cookies;

            const data = await this.authService.validateEmailToken({refreshToken: refreshToken, accessToken: token});
            req.user = data.user; 
            return data.user.roles.some((role: { value: string; }) => requiredRoles.includes(role.value));
        } catch (e) {
            console.log(e);
            throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN)
        }
    }

}