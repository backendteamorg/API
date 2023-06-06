import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as dotenv from 'dotenv';
dotenv.config();
import { Strategy, VerifyCallback } from "passport-google-oauth20"
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private googleAuthService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3000',
            display: "popup",
            scope: ['email', 'profile'],
        });
    }
    authorizationParams(options: any): object {
        return ({
            access_type: 'offline',
            prompt: 'consent'
        });
    };

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) { 
        const user = await this.googleAuthService.googleAuthRedirect({displayName: profile.displayName, email: profile.emails[0].value,refreshToken: refreshToken, userId: profile.id});
        done(null, {user: user, accessToken: accessToken });
    }
}   