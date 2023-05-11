import { PassportSerializer } from "@nestjs/passport";

import { Inject, Injectable } from "@nestjs/common";
import { GoogleAuthService } from "./google_auth.service";

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