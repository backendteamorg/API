import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';;
import { GoogleUser } from './user.model';
import * as jwt from 'jsonwebtoken';
import { CreateGoogleUserDto } from './dto/createGoogleUser.dto';
import * as dotenv from 'dotenv';
import { ValidateGoogleToken } from './dto/validateGoogleToken.dto';
import { RoleService } from '../role/role.service';
dotenv.config();

@Injectable()
export class GoogleAuthService {
    constructor(@InjectModel(GoogleUser) private userRepo: typeof GoogleUser, private roleService: RoleService) {}
    
    async createUser(userDto: CreateGoogleUserDto) {
        const candidate = await this.userRepo.findOne({where: {email : userDto.email}, include: {all:true}});
        if(candidate) {
            const tokens = await this.generateTokens({name: candidate.email, id: candidate.id});
            candidate.refreshToken = tokens.refreshToken
            candidate.accessToken = tokens.accessToken
            candidate.save()
            return {email: candidate.email,  accessToken: candidate.accessToken, refreshToken: candidate.refreshToken};
        }

        const user = await this.userRepo.create(userDto);
        const tokens = await this.generateTokens({name: user.email, id: candidate.id});
        return {email: user.email, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken}
    }

    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return { 
            accessToken,
            refreshToken
        }
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepo.findOne({where: {email: email}, include: {all:true}});
        return user;
    }
    
    async validateAccessToken(accessToken: string) {
        try {
            const userData = await jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            const { email } = userData;
            const user = await this.userRepo.findOne({where: { email: email}, include: {all:true}});
         return user;
        } catch(e) {
            return e;
        }
    }
    async getRefreshByAccess(token){
        const user = await this.userRepo.findOne({where:{accessToken:token}})
        return {refreshToken:user.refreshToken}
    }
    async refresh(refrershToken: string) {
        if (!refrershToken) {
            throw new UnauthorizedException();
        }

        const userData = await this.validateRefreshToken(refrershToken); 
        const user = await this.userRepo.findOne({where: {refreshToken: refrershToken}});
        if(!userData || !user) {
            throw new UnauthorizedException();
        }        
        const tokens = await this.generateTokens({email: user.email});
        user.refreshToken = tokens.refreshToken;

        return {...tokens};
    }

    async validateRefreshToken(token: string) {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return userData;
    }


}