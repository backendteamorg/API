import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import * as dotenv from 'dotenv';
//import { GoogleAuthService } from "../google-auth.service";
import axios from 'axios';
import { VkontakteAuthService } from "../vkontakte-auth.service";

dotenv.config();

@Injectable()
export class GoogleAuthMiddleware implements NestMiddleware {
    constructor(private userService: VkontakteAuthService) {}

    async use(req, res, next) {
        try { 
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next(new UnauthorizedException());
            }
            let accessToken = authorizationHeader.split(' ')[1];
            if (!accessToken) {   
                return next(new UnauthorizedException());
            }
            const userData = await this.validateToken(accessToken);
            const { error } = userData;

            if(error) {
                try {     
                    const {vkRefreshToken} = req.cookies;
                    console.log(vkRefreshToken);
                    
                    accessToken = vkRefreshToken;
                } catch (e ){
                    return new UnauthorizedException();
                }   
            } 
            const userDataFromBD = await this.userService.getUserById(accessToken);
            req.user = {displayName: userDataFromBD.displayName, userId: userDataFromBD.id};          
            next(); 
        } catch(e) {
            return next(new UnauthorizedException());
        }
    }

    async validateToken(accessToken: string) {
        try {  
            const response = await axios.get(`https://api.vk.com/method/users.get?v=5.131&access_token=${accessToken}`);
            console.log(response.data);
            
            return response.data;
        } catch(e) { 
            console.log(e);
                   
            return new UnauthorizedException();
        }
    }

}
