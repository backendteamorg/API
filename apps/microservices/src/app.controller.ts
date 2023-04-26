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
  @Inject('COUNTRIES_SERVICE') private rabbitCountriesFilmsService: ClientProxy,
  @Inject('NAMESOFFILMS_SERVICE') private rabbitNamesOfFilmsService: ClientProxy,
  @Inject('WHATCHABILITY_SERVICE') private rabbitwatchabilityService: ClientProxy,
  @Inject('FACTSOFFILMS_SERVICE') private rabbitfactsoffilmsService: ClientProxy,
  @Inject('PRODUCRCOMPANIES_SERVICE') private rabbitProductionCompaniesFilmsService: ClientProxy,
  @Inject('SPOKENLANGUAGE_SERVICE') private rabbitSpokenLanguageService: ClientProxy,
  @Inject('VIDEOS_SERVICE') private rabbitVideosService: ClientProxy,
  @Inject('SEQUEILANDPRIQUELS_SERVICE') private rabbitequelsandprequelsService: ClientProxy,
  @Inject('PERSONQWE_SERVICE') private rabbitePersonService: ClientProxy,
  @Inject('SPOSES_OF_PERSONQWE_SERVICE') private rabbitesSpousesPersonService: ClientProxy,
  @Inject('ROLES_SERVICE') private rabbitesRoleService: ClientProxy,
  @Inject('REVIEWS_SERVICE') private rabbitesReviewsOfFilmsService: ClientProxy) {}


  @ApiTags('Роли')
  @Post('createrole')
  async createRole(
    @Body('value') value: string,
    @Body('description') description: string,
    ) {
      return await this.rabbitesRoleService.send(
          {
            cmd: 'create-role',
          },
          {
            value,
            description,
          },
        );
      }
@ApiTags('Роли')
@Get('role/:value')
async getRole(
  @Param('value') value: string) {
    return await this.rabbitesRoleService.send(
        {
         cmd: 'get-role',
        },
        {value:value},
        );
   }
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
  @UseGuards(JwtAuthGuard)
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
  @ApiOperation({summary: 'Сделать запрос к api на информацию о фильмах с сайта "Кинопоиск"'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('films/parsing')
  async parsingFilms() {
    return await this.rabbitFilmsService.send({
      cmd: 'parser-films',
    },
    {});

  }
  @ApiOperation({summary: 'Сделать запрос к api на информацию о странах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('countries/parsing')
  async countriesParser() {
    return await this.rabbitCountriesFilmsService.send({
      cmd: 'parser-countries',
    },
    {});

  }
  @ApiTags('Данные с сайта kinopoisk')
  @ApiOperation({summary: 'Сделать запрос к api на информацию о людях учавствовавших в сьемках фильмов данные о которых были получены ранее'})
  @Get('personsofmovies/parsing')
  async parsingPersons() {
    return await this.rabbitPersonsFilmsService.send({
      cmd: 'parser-persons',
    },
    {});

  }
  @ApiTags('Данные с сайта kinopoisk')
  @ApiOperation({summary: 'Сделать запрос к api на информацию о названиях фильмов данные о которых были получены ранее'})
  @Get('namesoffilms/parsing')
  async parsingnamesOfFilms() {
    return await this.rabbitNamesOfFilmsService.send({
      cmd: 'parser-namesoffilms',
    },
    {});

  }
  @ApiTags('Данные с сайта kinopoisk')
  @ApiOperation({summary: 'Сделать запрос к api на информацию о том где смотреть фильмы данные о которых были получены ранее'})
  @Get('watchability/parsing')
  async parsingwatchability() {
    return await this.rabbitwatchabilityService.send({
      cmd: 'parser-watchability',
    },
    {});

  }
  @ApiTags('Данные с сайта kinopoisk')
  @ApiOperation({summary: 'Сделать запрос к api на информацию о фактах фильмов данные о которых были получены ранее'})
  @Get('factsofmovies/parsing')
  async parsingfactsofmovies() {
    return await this.rabbitfactsoffilmsService.send({
      cmd: 'parser-facts',
    },
    {});

  }
  @ApiOperation({summary: 'Получить информацию с api о жанрах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('genres/parsing')
  async genresgParser() {
    return await this.rabbitGenresFilmsService.send({
      cmd: 'parser-genres',
    },
    {});

}
@ApiTags('Данные с сайта kinopoisk')
  @ApiOperation({summary: 'Сделать запрос на информацию о компаниях учавстовавших в сьемках фильмов данные о которых были получены ранее'})
  @Get('productioncompanies/parsing')
  async parsingproductionCompanies() {
    return await this.rabbitProductionCompaniesFilmsService.send({
      cmd: 'parser-productioncompanies',
    },
    {});

}
@ApiOperation({summary: 'Получить информацию о языках на которых фильмы данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('spokenlanguage/parsing')
  async spokenlanguageParser() {
    return await this.rabbitSpokenLanguageService.send({
      cmd: 'spoken-langeage-parser',
    },
    {});

}
@ApiOperation({summary: 'Получить информацию о трейлерах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('videos/parsing')
  async videosParser() {
    return await this.rabbitVideosService.send({
      cmd: 'videos-parsing',
    },
    {});

}
@ApiOperation({summary: 'Получить информацию о сиквелах и приквелах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('sequelsandprequels/parsing')
  async sequelsandprequelsParser() {
    return await this.rabbitequelsandprequelsService.send({
      cmd: 'sequelsandprequels-parsing',
    },
    {});

}
@ApiOperation({summary: 'Сделать запрос к api чтобы получить тех кто снимался в фильмах данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('person/parsing')
  async personParser() {
    return await this.rabbitePersonService.send({
      cmd: 'parser-person',
    },
    {});

}
@ApiOperation({summary: 'Получить информацию о сиквелах и приквелах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('spousesperson/parsing')
  async spousespersonParser() {
    return await this.rabbitesSpousesPersonService.send({
      cmd: 'sposes-of-person-parser',
    },
    {});

}
@ApiOperation({summary: 'Получить пролфили тех кто учвтсовал в сьемках фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('get-person-profile')
  async getpersonProfile() {
    return await this.rabbitePersonService.send({
      cmd: 'get-all-person-profile',
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
  async GetGenres() {
    return await this.rabbitGenresFilmsService.send({
      cmd: 'get-all-genres',
    },
    {});

  }
  @ApiOperation({summary: 'Получить всех кто учавтсовал в сьемках фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('persons')
  async GetAllPerson() {
    return await this.rabbitPersonsFilmsService.send({
      cmd: 'get-all-persons',
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
  @ApiOperation({summary: 'Получить все сохраненные отзывы фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('getreviews')
  async getAllReviews() {
    return await this.rabbitesReviewsOfFilmsService.send({
      cmd: 'post-reviews',
    },
    {});

  }

}
