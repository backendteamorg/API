import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateVkUserDto } from './dto/createVkUser.dto';
import { CreateUserDto } from './dto/createuser.dto';
import { GoogleUserDto } from './dto/googleUser.dto';
import { ValidateToken } from './dto/validateGoogleToken.dto';

@Injectable()
export class AuthService {
    constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

    async googleAuthRedirect(userDto: GoogleUserDto) {
        const user = await (this.client.send('google.login', {...userDto})).toPromise();
        return user;
    }

    async vkAuthRedirect(userDto: CreateVkUserDto) {
        const data = await (this.client.send('vkontakte.login', {...userDto})).toPromise().catch((error) => console.log(error));
        return data;
    }
    
    async registration(userDto: CreateUserDto) {
        const user = await (this.client.send('create.user', {...userDto})).toPromise();
        return user;
    }

    async login(userDto: CreateUserDto) {
        const user = await (this.client.send('login.user', {...userDto})).toPromise();
        return user;
    }

    async validateEmailToken(dto: ValidateToken) {
        const user = await (this.client.send('validate.email.token', {...dto})).toPromise();
        return user;
    }

    async validateGoogleToken(dto: ValidateToken) {
        const data = await (this.client.send('validate.google.token', {...dto})).toPromise();
        return data;
    }

    async validateVkToken(dto: ValidateToken) {
        const data = await (this.client.send('validate.vk.token',{...dto})).toPromise();
        return data;
    }
}
