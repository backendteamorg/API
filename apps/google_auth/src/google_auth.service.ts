import { Injectable } from '@nestjs/common';
import { GoogleUser } from './google.user.model';
import { InjectModel } from '@nestjs/sequelize';
import { GoogleUserDto } from './dto/google.user.dto';

@Injectable()
export class GoogleAuthService {
    constructor(@InjectModel(GoogleUser) private userRepo: typeof GoogleUser) {}

    async validateUser(userDto: GoogleUserDto) {
        const user = await this.userRepo.findOne({where: {email: userDto.email}});
        if(user) return user;
        console.log('User has not been founded. Creating...');
        const newUser = await this.userRepo.create(userDto);
        return newUser;
    }

    async findUserByEmail(email: string) {
        const user = await this.userRepo.findOne({where: {email}});
        return user;
    }
}
