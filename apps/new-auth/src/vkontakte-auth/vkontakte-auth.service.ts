import { Injectable,UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VkUser } from './user.model';
import { CreateVkUserDto } from './dto/createVkUser.dto';
import axios from 'axios';
import { RoleService } from '../role/role.service';

@Injectable()
export class VkontakteAuthService {
    constructor(@InjectModel(VkUser) private userRepo: typeof VkUser, private roleService: RoleService){}
    async createUser(userDto: CreateVkUserDto) {
        const id = String(userDto.id);
        const candidate = await this.userRepo.findOne({where: {id: id}, include: {all:true}});

        if(candidate) {
            candidate.displayName = userDto.displayName;
            candidate.refreshToken = userDto.refreshToken;
            return candidate.save();
        }

        const user = await this.userRepo.create(userDto);

        const role = await this.roleService.getRoleByValue('user');
        await user.$set('roles', [role.id]);
        user.roles = [role];

        const userWithRoles = await this.userRepo.findOne({where: {id: user.id}, include: {all:true}});

        return userWithRoles;
    }

    async getUserById(userId: number) {
        const id = String(userId);
        const user = await this.userRepo.findOne({where: {id: id}, include: {all:true}});
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
