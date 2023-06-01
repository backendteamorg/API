import { Injectable,UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VkUser } from './user.model';
import { CreateVkUserDto } from './dto/createVkUser.dto';
import axios from 'axios';
@Injectable()
export class VkontakteAuthService {
    constructor(@InjectModel(VkUser) private userRepo: typeof VkUser){}
    async createUser(userDto: CreateVkUserDto) {
        const id = String(userDto.id);
        const candidate = await this.userRepo.findOne({where: {id: id}});

        if(candidate) {
            candidate.displayName = userDto.displayName;
            candidate.refreshToken = userDto.refreshToken;
            return candidate.save();
        }

        const user = await this.userRepo.create(userDto);
        return user;
    }

    async getUserById(userId: number) {
        const id = String(userId);
        const user = await this.userRepo.findOne({where: {id: id}});
        return user;
    }

    async validateToken(accessToken: string) {
        try {  
            const response = await axios.get(`https://api.vk.com/method/users.get?v=5.131&access_token=${accessToken}`);
            return response.data;
        } catch(e) { 
         return new UnauthorizedException();
        }
    }
}
