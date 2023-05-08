import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Profile } from './profile.model';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileDto } from './dto/profile.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, isEmpty } from 'rxjs';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
  @Inject('AUTH_SERVICE') private authrabbitServices){}
  private async getUser(idU: number) {
    const ob$ = await this.authrabbitServices.send(
      {
        cmd: 'get-user',
      },
      { id:idU },
    );

    const user = await firstValueFrom(ob$).catch((err) => console.error(err));
    return user;
  }
  async createProfile(dto: ProfileDto){
    if(await this.getUser(dto.userId)){
      const err = await this.profileRepository.findOne({where:{userId:dto.userId}})
        if(err){
          throw new HttpException('Профиль с таким ID уже зарегистрирован', HttpStatus.BAD_REQUEST)
        }
        else{
          const profile = await this.profileRepository.create(dto)
          return profile
        }
        
    }
    else{
        throw new HttpException('Пользователя с таким ID не существует', HttpStatus.BAD_REQUEST)
    }
}
async getProfileByUserId(userId:number){  
    const profile =   await this.profileRepository.findOne({where: {userId: userId}})
    return profile
}
async updateProfil(dto:ProfileDto){
    const profile =  await this.profileRepository.findOne({where: {userId: dto.userId}})
    profile.fisrt_name= dto.fisrt_name
    profile.second_name= dto.second_name
    profile.phonenumber= dto.phonenumber
    profile.save()
    return profile

}
async deleteProfile(userId:number){
    const profile =   await this.profileRepository.findOne({where: {userId: userId}})
    const id = profile.userId
    profile.destroy()
    return `Профиль пользователя ${id} удален`
}
async getProfiles(){
  return await this.profileRepository.findAll()
}
}
