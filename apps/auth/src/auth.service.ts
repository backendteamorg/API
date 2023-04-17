import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { AuthDto } from './dto/auth.dto';
import { Auth } from './auth.model';
import {InjectModel} from "@nestjs/sequelize";

@Injectable()
export class AuthService {  
     constructor(@InjectModel(Auth) private authRepository: typeof Auth,
     private jwtService: JwtService){}
     async login(userDto: AuthDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }
    async getOneUser(idU:number){
        return await this.authRepository.findOne({where:{id:idU}})
    }
    async getAllUsers(){
        return await this.authRepository.findAll()
    }
    async registration(dto: AuthDto) {
        const candidate = await this.authRepository.findOne({where:{email:dto.email}})
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.authRepository.create({...dto, password: hashPassword})
        return this.generateToken(user)
    }

    private async generateToken(user: Auth) {
        const payload = {email: user.email, id: user.id}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(dto: AuthDto) {
        const user = await this.authRepository.findOne({where:{email:dto.email}})
        const passwordEquals = await bcrypt.compare(dto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
}
