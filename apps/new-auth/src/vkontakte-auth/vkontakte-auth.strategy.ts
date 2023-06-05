import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, Profile, VerifyCallback} from "passport-vkontakte";
import * as dotenv from 'dotenv';
import { VkontakteAuthService } from "./vkontakte-auth.service";
dotenv.config();


@Injectable()
export class VKStrategy extends PassportStrategy(Strategy, "vkontakte") {
    constructor(private userService: VkontakteAuthService) {
        super({
            clientID: process.env.VK_CLIENT_ID,
            clientSecret: process.env.VK_SECRET,
            callbackURL: process.env.VK_REDIRECT_URI,
            scope: ['profile'],
        }, async function(accessToken: string,params: any,profile: any,done: VerifyCallback
        ) {  
             const user = await userService.createUser({displayName: profile.displayName, refreshToken: accessToken,
                 id: profile.id});
            return done(null, {user: user, accessToken: user});
        });
    }
}