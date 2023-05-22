import { Controller, Get,Inject,Post,Body, UseGuards, Put,Param ,Delete, Patch, Req,Query} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiCreatedResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles-auth.decorator';
import { IsEmail, IsString } from 'class-validator';
import { GoogleAuthGuard } from './gooogle.guard';
import { FilteDto } from 'apps/films/src/dto/filtre.dto';



@Controller()
export class AppController {
  constructor(
  @Inject('AUTH_SERVICE') private rabbitAuthService: ClientProxy,
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
  @Inject('REVIEWS_SERVICE') private rabbitesReviewsOfFilmsService: ClientProxy,
  @Inject('NAMESOFGENRES_SERVICE') private rabbitnamesofGenresService: ClientProxy,) {}


  @ApiTags('Роли')
  @Post('createrole')
  @ApiOperation({summary: 'Создать роль {"value":"ADMIN","description":"Администратор"}'})
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
  @ApiOperation({summary: 'Регистрация {"email":"ADMIN@mail.ru","password":"Администратор"}'})
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
    @ApiOperation({summary: 'Вход {"email":"ADMIN@mail.ru","password":"Администратор"}'})
    @Post('login')
    async login(
      @Body('email') email: string,
      @Body('password') password: string,
    ) {
      return await this.rabbitAuthService.send(
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
  @ApiTags('(Отключено) Профиль')
  @ApiOperation({summary: 'TITLE_PROFILE'})
  @Get('title_profile')
  async getPorifle() {
      return this.rabbitProfileService.send({
      cmd: 'get-title',
    },
   {});

  } 
  @ApiOperation({summary: 'Получить все профили'})
  @ApiTags('(Отключено) Профиль')
  @Get('profiles')
    async getProfiles() {
      return await this.rabbitProfileService.send({
        cmd: 'get-profiles',
      },
      {}
      );

    }
  @ApiTags('(Отключено) Профиль')
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
  @ApiTags('(Отключено) Профиль')
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async createProfile(
    @Body('userId') userId: number,
    @Body('fisrt_name') fisrt_name: string,
    @Body('second_name') second_name: string,
    @Body('phonenumber') phonenumber: string,
  ) {
    return await this.rabbitProfileService.send(
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
  @ApiTags('(Отключено) Профиль')
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Body('userId') userId: number,
    @Body('fisrt_name') fisrt_name: string,
    @Body('second_name') second_name: string,
    @Body('phonenumber') phonenumber: string,) {
    return await this.rabbitProfileService.send(
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
  @ApiTags('(Отключено) Профиль')
  @Delete('profile/:id')
    async deletePorfile(@Param('id') id:number) {
      return await this.rabbitProfileService.send({
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
  @ApiTags('Данные с api kinopoisk')
  @Get('admin/films/parsing')
  async parsingFilms() {
    return await this.rabbitFilmsService.send({
      cmd: 'parser-films',
    },
    {});

  }
  
  @ApiOperation({summary: 'Сделать запрос к api на информацию о странах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с api kinopoisk')
  @Get('admin/countries/parsing')
  async countriesParser() {
    return await this.rabbitCountriesFilmsService.send({
      cmd: 'parser-countries',
    },
    {});

  }
  
  @ApiTags('Данные с api kinopoisk')
  @ApiOperation({summary: 'Сделать запрос к api на информацию о людях учавствовавших в сьемках фильмов данные о которых были получены ранее'})
  @Get('admin/personsofmovies/parsing')
  async parsingPersons() {
    return await this.rabbitPersonsFilmsService.send({
      cmd: 'parser-persons',
    },
    {});

  }
 
  @ApiTags('Данные с api kinopoisk')
  @ApiOperation({summary: 'Сделать запрос к api на информацию о названиях фильмов данные о которых были получены ранее'})
  @Get('admin/namesoffilms/parsing')
  async parsingnamesOfFilms() {
    return await this.rabbitNamesOfFilmsService.send({
      cmd: 'parser-namesoffilms',
    },
    {});

  }
 
  
  
 

  @ApiOperation({summary: 'Получить информацию с api о жанрах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с api kinopoisk')
  @Get('admin/namesofgenres/parsing')
  async nemesofgenresgParser() {
    return await this.rabbitnamesofGenresService.send({
      cmd: 'parser-namesofgenres',
    },
    {});

}
  
  @ApiOperation({summary: 'Получить информацию с api о жанрах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с api kinopoisk')
  @Get('admin/genres/parsing')
  async genresgParser() {
    return await this.rabbitGenresFilmsService.send({
      cmd: 'parser-genres',
    },
    {});

}





@ApiOperation({summary: 'Получить c api информацию о трейлерах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с api kinopoisk')
  @Get('admin/videos/parsing')
  async videosParser() {
    return await this.rabbitVideosService.send({
      cmd: 'videos-parsing',
    },
    {});

}



@ApiOperation({summary: 'Сделать запрос к api чтобы получить тех кто снимался в фильмах данные о которых были получены ранее'})
  @ApiTags('Данные с api kinopoisk')
  @Get('admin/person/parsing')
  async personParser() {
    return await this.rabbitePersonService.send({
      cmd: 'parser-person',
    },
    {});

}




@ApiOperation({summary: 'Получить сохраненные данные о фильмах используя фильтры {"genre":["семейный"],"countries":["Венгрия"],"ratingKp":5,"votesKp":5,"director":"Э","actor":"Доро"'})
@ApiTags('(Фильры) Данные с сайта kinopoisk')

@Get('movies')
async getFilmsUseFiltres(
  @Query() queryParams: any
) {
  return await this.rabbitFilmsService.send(
    {
      cmd: 'get-films-use-filtres',
    },
    {queryParams:queryParams},
  );
}
@ApiOperation({summary: 'Получить все сохраненные данные о фильмах'}) /////////////////////////////////////////////////////////////(Суммарные данные)//////////////////////
@ApiTags('(Суммарные данные) с сайта kinopoisk')
@Get('filmswithinfo')
async getAllFilmsWithInfo() {
  return await this.rabbitFilmsService.send({
    cmd: 'get-all-films-with-info',
  },
  {});

}
@ApiOperation({summary: 'Получить все сохраненные данные о фильмах которые могут понравиться'})
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Delete('filmconoriymogutPonravitsa/:id')
  async esliWavPonravilsa(
    @Param('id') id: number) {
    return await this.rabbitFilmsService.send(
      {
        cmd: 'esli-vam-ponravilsa-film',
      },
      {id:id},
    );
  }
@ApiOperation({summary: 'Получить сохраненный фильм по id'})
@ApiTags('(Суммарные данные) с сайта kinopoisk')
@Get('film/:id')
async getFilm(
  @Param('id') id: number) {
    return await this.rabbitFilmsService.send(
        {
         cmd: 'get-film-by-id',
        },
        {id:id},
        );
}
@ApiOperation({summary: 'Получить все сохраненные данные о тех кто учавтсовал в сьемках фильмов данные о которых были получены ранее'})
  @ApiTags('(Суммарные данные) с сайта kinopoisk')
  @Get('personswithinfo')
  async GetAllPersonWithInfo() {
    return await this.rabbitPersonsFilmsService.send({
      cmd: 'get-all-persons-with-info',
    },
    {});

  }

  @ApiOperation({summary: 'Получить всю инфомрацию о персоне по id'})
  @ApiTags('(Суммарные данные) с сайта kinopoisk')
  @Get('personWithAllInfo/:id')
  async getPersonWithAllInfo(
    @Param('id') id: number) {
    return await this.rabbitPersonsFilmsService.send(
      {
        cmd: 'get-all-info-personsoffilms-by-personid',
      },
      {id:id},
    );
  }

@ApiOperation({summary: 'Получить сохраненные данные о фильмах'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('films')
  async getAllFilms() {
    return await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});

}


@ApiOperation({summary: 'Получить все  сохраненные профили тех кто учавcтвовал в сьемках фильмов данные о которых были сохранены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('personsprofile')
  async getpersonProfile() {
    return await this.rabbitePersonService.send({
      cmd: 'get-all-person-profile',
    },
    {});

}
@ApiOperation({summary: 'Получить сохраненную информацию о жанрах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('namesgenres')
  async GetnamesGenres() {
    return await this.rabbitnamesofGenresService.send({
      cmd: 'get-namesofgenres',
    },
    {});

  }
  @ApiOperation({summary: 'Получить сохраненную информацию о жанрах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('allgenres')
  async GetGenres() {
    return await this.rabbitGenresFilmsService.send({
      cmd: 'get-all-genres',
    },
    {});

  }
  @ApiOperation({summary: 'Получить сохраненную информацию о названиях фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('allnamesOfFilm')
  async GetNamesOfFilms() {
    return await this.rabbitNamesOfFilmsService.send({
      cmd: 'get-all-namesoffilms',
    },
    {});

  }
  @ApiOperation({summary: 'Получить все сохраненные данные о тех кто учавтсовал в сьемках фильмов данные о которых были получены ранее'})
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
  @ApiOperation({summary: 'Получить сохраненные данные о фактах фильма'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('genres/:id')
  async getGenreByMovieId(
    @Param('id') id: number) {
      return await this.rabbitGenresFilmsService.send(
          {
           cmd: 'get-genres-by-moveid',
          },
          {id:id},
          );
  }
 
  
  @ApiOperation({summary: 'Получить сохраненные данные о фактах фильма'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('namesOfFilm/:id')
  async getNamesOfFilmsByMovieId(
    @Param('id') id: number) {
      return await this.rabbitNamesOfFilmsService.send(
          {
           cmd: 'get-namesOfFilms-by-moveid',
          },
          {id:id},
          );
  }
  @ApiOperation({summary: 'Получить сохраненные данные о сьемочной группе'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('personsfMovie/:id')
  async getPersonsOfMovieyMovieId(
    @Param('id') id: number) {
      return await this.rabbitPersonsFilmsService.send(
          {
           cmd: 'get-personsoffilms-by-moveid',
          },
          {id:id},
          );
  }
  @ApiOperation({summary: 'Получить сохраненный профиль человека учествовавшего в сьемках фильма сохраненного в бд'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('person/:id')
  async getPersonById(
    @Param('id') id: number) {
      return await this.rabbitePersonService.send(
          {
           cmd: 'get-person-by-id',
          },
          {id:id},
          );
  }







  @ApiOperation({summary: 'Получить сохраненные данные о видео, фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('videosByMovieId/:id')
  async getVideosByMovieId(
    @Param('id') id: number) {
      return await this.rabbitVideosService.send(
          {
           cmd: 'get-videos-by-moveid',
          },
          {id:id},
          );
  }





  @ApiOperation({summary: 'Получить сохраненные данные о странах фильма'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('countries/:id')
  async getCountries(
    @Param('id') id: number) {
      return await this.rabbitCountriesFilmsService.send(
          {
           cmd: 'get-countries-by-movieid',
          },
          {id:id},
          );
    }


  
  @ApiOperation({summary: 'Сделать отзыв к фильму данные о котором были получены ранее {"movieid":301,"title":"Лучший фильм","review":"Это лучший фильм который я смотрел","author":"asd"}'})
  @ApiTags('Отзывы и комментарии')
  @Post('postreview')
  async getReviews(
  @Body('movieid') movieid: number,
  @Body('title') title: string,
  @Body('review') review: string,
  @Body('author') author: string
  ) {
    
    return await this.rabbitesReviewsOfFilmsService.send({
      cmd: 'post-review',
    },
    {
      movieid,
      title,
      review,
      author
    });

  }
  @ApiOperation({summary: 'Сделать коментарий к отзыву фильма данные о котором были получены ранее {"reviewid":1,"title":"Согласен","comment":"Аналогично","author":"asd"}'})
  @ApiTags('Отзывы и комментарии')
  @Post('postreviewcomment')
  async getReviewsComment(
  @Body('reviewid') reviewid: number,
  @Body('title') title: string,
  @Body('comment') comment: string,
  @Body('author') author: string
  ) {
    
    return await this.rabbitesReviewsOfFilmsService.send({
      cmd: 'post-review-comment',
    },
    {
      reviewid,
      title,
      comment,
      author
    });

  }
  
  @ApiOperation({summary: 'Изменить название фильма (Пример: {"id":301, "name":"Matrix"})'})
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Patch('film')
  async updateNameOfMovie(
    @Body('id') id: number,
    @Body('name') name: string) {
    return await this.rabbitFilmsService.send(
      {
        cmd: 'update-nameoffilm',
      },
      {
        id,
        name
      },
    );
  }
  
  @ApiOperation({summary: 'Изменить название жанра (Пример: {"id":1, "genre:"драма","enName":"drame"})'})
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Patch('namesofgenre')
  async updateGenreOfMovie(
    @Body('id') id: number,
    @Body('enName') enName: string) {
    return await this.rabbitnamesofGenresService.send(
      {
        cmd: 'update-namesgenres',
      },
      {
        id,
        enName
      },
    );
  }
  @ApiOperation({summary: 'Удалить название жанра по id'})
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Delete('namesofgenre/:id')
  async deleteGenreOfMovie(
    @Param('id') id: number) {
    return await this.rabbitnamesofGenresService.send(
      {
        cmd: 'delete-genre-by-id',
      },
      {id:id},
    );
  }


  
}
