import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { Request } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateGoogleUserDto } from './dto/createGoogleUser.dto';
import { ValidateGoogleToken } from './dto/validateGoogleToken.dto';

@Controller('google')
export class GoogleAuthController {
    constructor(private googleService: GoogleAuthService) {}

    @MessagePattern('google.login')
    async googleAuthRedirect(@Payload() data: CreateGoogleUserDto) { 
        const user = await this.googleService.createUser(data); 
        return {refreshToken: user.refreshToken, userEmail: user.email, userRole: user.roles};
    }

    @MessagePattern('validate.google.token')
    async validateAccesToken(@Req() req: Request, @Payload() dto: ValidateGoogleToken) {
        return await this.googleService.validateAccessToken(dto);
    }
}
