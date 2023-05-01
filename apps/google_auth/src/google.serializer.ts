import { PassportSerializer } from "@nestjs/passport";
import { GoogleAuthService } from "./google-auth.service";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private googleAuthService: GoogleAuthService) {
        super();
        
    }

    serializeUser(user: any, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.googleAuthService.findUserByEmail(payload.email);
        return user ? done(null, user) : done(null, null);
    }
}