import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as dotenv from 'dotenv';
dotenv.config();
import { Strategy } from "passport-google-oauth20";
import { GoogleAuthService } from "./google_auth.service";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private googleAuthService: GoogleAuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3000/google/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        const user = await this.googleAuthService.validateUser({email: profile.emails[0].value, profileName: profile.displayName});
        return user || null;
    }
}   