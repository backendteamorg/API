import { Controller, Get,Inject,Post,Body, UseGuards, Put,Param ,Delete} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private rabbitAuthService: ClientProxy,
  @Inject('PROFILE_SERVICE') private rabbitProfileService: ClientProxy,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy) {}
  @Get('title_users')
  async getUser() {
      return await this.rabbitAuthService.send({
        cmd: 'get-title',
      },
      {});

    }
  @Get('users')
    async getUsers() {
      return await this.rabbitAuthService.send({
        cmd: 'get-users',
      },
      {});

    }
  @Get('profiles')
    async getProfiles() {
      return await this.rabbitProfileService.send({
        cmd: 'get-profiles',
      },
      {}
      );

    }
    @Get('profile/:id')
    async getProfile(@Param('id') id:number) {
      return await this.rabbitProfileService.send({
        cmd: 'get-profile',
      },
      {id}
      );

    }
  @Get('title_profile')
    async getPorifle() {
       return this.rabbitProfileService.send({
        cmd: 'get-title',
      },
      {});

    }
  @Post('registration')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.rabbitAuthService.send(
      {
        cmd: 'registration',
      },
      {
        email,
        password,
      },
    );
  }
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.rabbitAuthService.send(
      {
        cmd: 'login',
      },
      {
        email,
        password,
      },
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async createProfile(
    @Body('userId') userId: number,
    @Body('fisrt_name') fisrt_name: string,
    @Body('second_name') second_name: string,
    @Body('phonenumber') phonenumber: string,
  ) {
    return this.rabbitProfileService.send(
      {
        cmd: 'create-profile',
      },
      {
        userId,
        fisrt_name,
        second_name,
        phonenumber
      },
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Body('userId') userId: number,
    @Body('fisrt_name') fisrt_name: string,
    @Body('second_name') second_name: string,
    @Body('phonenumber') phonenumber: string,) {
    return this.rabbitProfileService.send(
      {
        cmd: 'update-profile',
      },
      {
        userId,
        fisrt_name,
        second_name,
        phonenumber
      },
    );
  }
  @Delete('profile/:id')
    deletePorfile(@Param('id') id:number) {
      return this.rabbitProfileService.send({
        cmd: 'delete-profile',
      },
      {id}
      );

    }
  @Get('films/parsing')
  async parsing() {
    return await this.rabbitFilmsService.send({
      cmd: 'get-films',
    },
    {});

  }
  @Get('films-title')
  async getFilmsTitle() {
    return await this.rabbitFilmsService.send({
      cmd: 'get-films-title',
    },
    {});

  }
  @Get('films')
  async getAllFilms() {
    return await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});

  }
}
