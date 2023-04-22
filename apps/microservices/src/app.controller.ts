import { Controller, Get,Inject,Post,Body, UseGuards, Put,Param ,Delete} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private rabbitAuthService: ClientProxy,
  @Inject('PROFILE_SERVICE') private rabbitProfileService: ClientProxy,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy,
  @Inject('PERSONS_SERVICE') private rabbitPersonsFilmsService: ClientProxy,
  @Inject('GENRES_SERVICE') private rabbitGenresFilmsService: ClientProxy,
  @Inject('COUNTRIES_SERVICE') private rabbitCountriesFilmsService: ClientProxy) {}

  @ApiTags('Регистрация и вход')
  @Post('registration')
  @ApiProperty({type:String})
  @ApiOperation({summary: 'Регистрация'})
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
    @ApiTags('Регистрация и вход')
    @ApiOperation({summary: 'Вход'})
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
  @ApiTags('Пользователи')
  @ApiOperation({summary: 'TITLE_USERS'})
  @Get('title_users')
  async getUser() {
      return await this.rabbitAuthService.send({
        cmd: 'get-title',
      },
      {});

    }
  @ApiTags('Пользователи')
  @ApiOperation({summary: 'Получить всех пользователей'})
  @Get('users')
    async getUsers() {
      return await this.rabbitAuthService.send({
        cmd: 'get-users',
      },
      {});

  }
  @ApiTags('Профиль')
  @ApiOperation({summary: 'TITLE_PROFILE'})
  @Get('title_profile')
  async getPorifle() {
      return this.rabbitProfileService.send({
      cmd: 'get-title',
    },
   {});

  } 
  @ApiOperation({summary: 'Получить все профили'})
  @ApiTags('Профиль')
  @Get('profiles')
    async getProfiles() {
      return await this.rabbitProfileService.send({
        cmd: 'get-profiles',
      },
      {}
      );

    }
  @ApiTags('Профиль')
  @ApiOperation({summary: 'Получить профиль по ИН пользователя'})
  @Get('profile/:id')
  async getProfile(@Param('id') id:number) {
    return await this.rabbitProfileService.send({
      cmd: 'get-profile',
    },
    {id}
    );

  }
  @ApiOperation({summary: 'Создать профиль'})
  @ApiTags('Профиль')
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
  @ApiOperation({summary: 'Обновить профиль'})
  @ApiTags('Профиль')
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
  @ApiOperation({summary: 'Удалить профиль'})
  @ApiTags('Профиль')
  @Delete('profile/:id')
    deletePorfile(@Param('id') id:number) {
      return this.rabbitProfileService.send({
        cmd: 'delete-profile',
      },
      {id}
      );

  }
  @ApiOperation({summary: 'TITLE_FILM'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('films-title')
  async getFilmsTitle() {
    return await this.rabbitFilmsService.send({
      cmd: 'get-films-title',
    },
    {});

  }
  @ApiOperation({summary: 'Сделать запрос на информацию о фильмах с сайта "Кинопоиск"'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('films/parsing')
  async parsingFilms() {
    return await this.rabbitFilmsService.send({
      cmd: 'parser-films',
    },
    {});

  }
  @ApiOperation({summary: 'Сделать запрос на информацию о странах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('countries/parsing')
  async countriesParser() {
    return await this.rabbitCountriesFilmsService.send({
      cmd: 'parser-countries',
    },
    {});

  }
  @ApiTags('Данные с сайта kinopoisk')
  @ApiOperation({summary: 'Сделать запрос на информацию о людях учавствовавших в сьемках фильмов данные о которых были получены ранее'})
  @Get('persons/parsing')
  async parsingPersons() {
    return await this.rabbitPersonsFilmsService.send({
      cmd: 'parser-persons',
    },
    {});

  }
  @ApiOperation({summary: 'Получить все сохраненные данные о фильмах'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('films')
  async getAllFilms() {
    return await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});

  }
  @ApiOperation({summary: 'Получить информацию о жанрах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('genres')
  async genresgParser() {
    return await this.rabbitGenresFilmsService.send({
      cmd: 'get-all-genres',
    },
    {});

  }
  @ApiOperation({summary: 'Получить все сохраненные данные о странах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('countriesOffilm')
  async getAllCountries() {
    return await this.rabbitCountriesFilmsService.send({
      cmd: 'get-all-countries',
    },
    {});

  }

}
