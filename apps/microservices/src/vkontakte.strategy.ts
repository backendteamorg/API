import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, Profile, VerifyCallback} from "passport-vkontakte";
import * as dotenv from 'dotenv';
import { AuthService } from "./auth.service";
dotenv.config();


@Injectable()
export class VKStrategy extends PassportStrategy(Strategy, "vkontakte") {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.VK_CLIENT_ID,
            clientSecret: process.env.VK_SECRET,
            callbackURL: process.env.VK_REDIRECT_URI,
            scope: ['profile'],
        }, async function(accessToken: string,params: any,profile: any,done: VerifyCallback) {  
           const user = await authService.vkAuthRedirect({displayName: profile.displayName, refreshToken: accessToken,id: profile.id});                                  
            done(null, user );
        });
    }
}