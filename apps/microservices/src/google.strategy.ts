import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as dotenv from 'dotenv';
dotenv.config();
import { Strategy } from "passport-google-oauth20";
import { GoogleAuthService } from "../../google_auth/src/google_auth.service";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private googleAuthService: GoogleAuthService) {
        super({
            clientID: "155171919409-vrjg8461co0k7ub7rljhhu84b7in4ah1.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: 'http://localhost:6125/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        const user = await this.googleAuthService.validateUser({email: profile.emails[0].value, profileName: profile.displayName});
        return user || null;
    }
}   