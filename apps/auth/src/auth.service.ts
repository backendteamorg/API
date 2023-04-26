import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { AuthDto } from './dto/auth.dto';
import { Auth } from './auth.model';
import {InjectModel} from "@nestjs/sequelize";
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AuthService {  
     constructor(@InjectModel(Auth) private authRepository: typeof Auth,
     @Inject('ROLES_SERVICE') private rolesService,
     private jwtService: JwtService){}
     

     async getUserFromHeader(jwt: string): Promise<UserJwt> {
        if (!jwt) return;
    
        try {
          return this.jwtService.decode(jwt) as UserJwt;
        } catch (error) {
          throw new BadRequestException();
        }
      }


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

    private async getRole(valueREQ: string) {
        const ob$ = await this.rolesService.send(
          {
            cmd: 'get-role',
          },
          { value:valueREQ },
        );
    
        const role = await firstValueFrom(ob$).catch((err) => console.error(err));
        return role;
      }

    async registration(dto: AuthDto) {
        const candidate = await this.authRepository.findOne({where:{email:dto.email}})
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        try{
            const role = await this.getRole("USER")
            const hashPassword = await bcrypt.hash(dto.password, 5);
            const user = await this.authRepository.create({email:dto.email, password: hashPassword,role:role.value})
            return this.generateToken(user)
        }
        catch(e){
            console.log(e)
            throw 'Проверьте включен ли сервис roles'
        }
    }

    private async generateToken(user: Auth) {
        const payload = {email: user.email, id: user.id,role:user.role}
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
