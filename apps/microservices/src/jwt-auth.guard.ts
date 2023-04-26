import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,Inject} from "@nestjs/common";
import {Observable, catchError, of, switchMap} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        @Inject('AUTH_SERVICE') private rabbitAuthService: ClientProxy) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const user = this.jwtService.verify(token);
            
            req.user = user;
            this.rabbitAuthService.send({
                cmd: 'decode-jwt'
            },{user}).pipe(
                switchMap(({ exp }) => {
                  if (!exp) return of(false);
          
                  const TOKEN_EXP_MS = exp * 1000;
          
                  const isJwtValid = Date.now() < TOKEN_EXP_MS;
          
                  return of(isJwtValid);
                }),
                catchError(() => {
                  throw new UnauthorizedException();
                }),
              );
            return true;
        } catch (e) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
    }

}
