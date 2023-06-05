import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';;
import { GoogleUser } from './user.model';
import * as jwt from 'jsonwebtoken';
import { CreateGoogleUserDto } from './dto/createGoogleUser.dto';
import axios from 'axios';
import { ValidateGoogleToken } from './dto/validateGoogleToken.dto';
import { RoleService } from '../role/role.service';

@Injectable()
export class GoogleAuthService {
    constructor(@InjectModel(GoogleUser) private userRepo: typeof GoogleUser, private roleService: RoleService) {}

    async createUser(userDto: CreateGoogleUserDto) {
        const candidate = await this.userRepo.findOne({where: {email: userDto.email}, include: {all:true}});
        if(candidate) {
            candidate.displayName = userDto.displayName;
            candidate.refreshToken = userDto.refreshToken;
            return candidate.save();
        }
        
        const user = await this.userRepo.create(userDto);

        const role = await this.roleService.getRoleByValue('user');
        await user.$set('roles', [role.id]);
        user.roles = [role];

        const userWithRoles = await this.userRepo.findOne({where: {email: user.email}, include: {all:true}});
        
        return userWithRoles;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepo.findOne({where: {email: email}, include: {all:true}});
        return user;
    }

    async refreshToken(refreshToken: string) {
        console.log(refreshToken);
        
        const response = await axios.post('https://www.googleapis.com/oauth2/v4/token', {
            client_id: "566384345920-v5ce4vga2onnu8spm5fv97lbc441pojp.apps.googleusercontent.com",
            client_secret: "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",
            refresh_token: refreshToken,
            grant_type: "refresh_token"
        })
        return {accessToken: response.data.access_token, refreshToken: refreshToken};
    }

    async validateAccessToken(dto: ValidateGoogleToken) {

        let tokens = {accessToken: dto.accessToken, refreshToken: dto.refreshToken};
        const userData = await this.validateTokenViaGoogle(dto.accessToken);
        if(userData instanceof UnauthorizedException) {
            tokens = await this.refreshToken(dto.refreshToken);
            console.log('TOKENS HAS BEEN UPDATED');
        }
        const validatedToken = await this.validateTokenViaGoogle(tokens.accessToken);
        const userDataFromDB = await this.getUserByEmail(validatedToken.email);
        console.log(userDataFromDB);
        

        return {refreshToken: tokens.refreshToken, accessToken: tokens.accessToken, 
            id: userDataFromDB.userId, displayName: userDataFromDB.displayName, email: userDataFromDB.email, roles: userDataFromDB.roles};
    }
    

    async validateTokenViaGoogle(accessToken: string) {
        try {
            const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
            return response.data;
        } catch(e) {        
            return new UnauthorizedException();
        }
    }

}
