import { Controller, UnauthorizedException} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VkontakteAuthService } from './vkontakte-auth.service';

@Controller('vkontakte-auth')
export class VkontakteAuthController {
    constructor(private authService: VkontakteAuthService){}
    @MessagePattern('vkontakte.login')
    async vkAuthRedirect(@Payload() data: any) {
        console.log('VK service got a message');
        const user = await this.authService.createUser(data);
        return user;
    }

    @MessagePattern('validate.vk.token')
    async validateToken(@Payload() data: any) {
        let accessToken = data.accessToken;
        let userData = await this.authService.validateToken(accessToken);
        const { error } = userData;
        if(error) {
            try {     
                const {vkRefreshToken} = data.refreshToken;
                accessToken = vkRefreshToken;
                userData = await this.authService.validateToken(accessToken);
            } catch (e ){
                return new UnauthorizedException();
            }   
        } 
        const userDataFromBD = await this.authService.getUserById(userData.response[0].id);
        return userDataFromBD;
    }
}
