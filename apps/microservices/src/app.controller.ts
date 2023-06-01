import { Controller, Get,Inject,Post,Body, UseGuards, Put,Param ,Delete, Patch, Req,Query, Res} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { IsEmail, IsString } from 'class-validator';

import { FilteDto } from 'apps/films/src/dto/filtre.dto';
import { AuthService } from './auth.service';
import { CommentsService } from './comments.service';
import { CreateUserDto } from './dto/createuser.dto';



@Controller()
export class AppController {
  constructor(
          private authService: AuthService,
          private commentService: CommentsService,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy,
  @Inject('PERSONS_SERVICE') private rabbitPersonsFilmsService: ClientProxy,
  @Inject('GENRES_SERVICE') private rabbitGenresFilmsService: ClientProxy,
  @Inject('COUNTRIES_SERVICE') private rabbitCountriesFilmsService: ClientProxy,
  @Inject('VIDEOS_SERVICE') private rabbitVideosService: ClientProxy,
  @Inject('NAMESOFGENRES_SERVICE') private rabbitnamesofGenresService: ClientProxy,
  @Inject('COUNTRIESNAMES_SERVICE') private rabbitnamesofCountriesService: ClientProxy,) {}


  
 
  
  @ApiOperation({summary: 'Сделать запрос к api на информацию о фильмах с сайта "Кинопоиск"'})
  @ApiTags('Данные с api kinopoisk')
  @Get('admin/films/parsing')
  async parsingFilms() {
    return await this.rabbitFilmsService.send({
      cmd: 'parser-films',
    },
    {});

  }
  

@ApiOperation({summary: 'Получить информацию о фильмов данные о которых были получены ранее'})
@ApiTags('Данные с api kinopoisk')
@Get('admin/getall/parsing')
async parsingAll() {
  return await this.rabbitFilmsService.send({
    cmd: 'parsing-all-info',
  },
  {});

}





@ApiOperation({summary: 'Получить сохраненные данные о фильмах используя фильтры. Доступные поля {limit, type, page ,genres, countries, ratingKp, votesKp, director,actor}. Пример ввода :localhost:6125/movies?genres=драма&genres=фантастика'})
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




@ApiOperation({summary: 'Получить сохраненные данные о фильмах'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('films')
  async getAllFilms() {
    return await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
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


  
  

  
    @ApiOperation({summary: 'Добавить (Пример: {"id":301, "name":"Матрица","enName":"Matrix"}) (все поля из базового запроса к фильмам)'})  //////////////////// CRUD фИЛЬМОВ
    @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
    @Post('film')
    async createFilm(
      @Body('id') id: number,
      @Body('type') type: string,
      @Body('name') name: string,
      @Body('enName') enName: string,
      @Body('posterUrl') posterUrl: string,
      @Body('posterPreviewURL') posterPreviewURL: string,
      @Body('premiereRussia') premiereRussia: string,
      @Body('hasIMAX') hasIMAX: boolean,
      @Body('year') year: number,
      @Body('description') description: string,
      @Body('shortDescription') shortDescription: string,
      @Body('ageRating') ageRating: number,
      @Body('ratingKp') ratingKp: number,
      @Body('votesKp') votesKp: number,
      @Body('movieLength') movieLength: number,) {
      return await this.rabbitFilmsService.send(
        {
          cmd: 'post-film',
        },
        {
          id,
          type,
          name,
          enName,
          posterUrl,
          posterPreviewURL,
          premiereRussia,
          hasIMAX,
          year,
          description,
          shortDescription,
          ageRating,
          ratingKp,
          votesKp,
          movieLength,
          
        },
      );
  }
  @ApiOperation({summary: 'Удалить фильм'})                  
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Delete('film/:id')
  async deleteFilmById(
    @Param('id') id: number) {
    return await this.rabbitFilmsService.send(
      {
        cmd: 'delete-film-by-id',
      },
      {
        id
      },
    );
  }
  @ApiOperation({summary: 'Удалить жанр'})
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Delete('namesofgenre/:id')
  async deleteGenreOfMovie(
    @Param('id') id: number) {
    return await this.rabbitnamesofGenresService.send(
      {
        cmd: 'delete-genre-by-id',
      },
      {
        id
      },
    );
  }
  @ApiOperation({summary: 'Удалить страну'})
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Delete('namesofcountry/:id')
  async deleteCountry(
    @Param('id') id: number) {
    return await this.rabbitnamesofCountriesService.send(
      {
        cmd: 'delete-country-by-id',
      },
      {
        id
      },
    );
  }
  @ApiOperation({summary: 'Изменить название фильма (Пример: {"id":301, "name":"Матрица","enName":"Matrix"})'}) 
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Patch('film')
  async updateNameOfMovie(
    @Body('id') id: number,
    @Body('name') name: string,
    @Body('enName') enName: string) {
    return await this.rabbitFilmsService.send(
      {
        cmd: 'update-nameoffilm',
      },
      {
        id,
        name,
        enName
      },
    );
  }

  
  @ApiOperation({summary: 'Изменить название жанра (Пример: {"id":1, "name:"драма","enName":"drame"})'}) //////////////////// CRUD ЖАНРОВ
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Patch('namesofgenre')
  async updateGenreOfMovie(
    @Body('id') id: number,
    @Body('name') name: string,
    @Body('enName') enName: string) {
    return await this.rabbitnamesofGenresService.send(
      {
        cmd: 'update-namesgenres',
      },
      {
        id,
        name,
        enName
      },
    );
  }
  @ApiOperation({summary: 'Добавить название жанра (Пример: {"id":1, "name:"драма","enName":"drame"})'})
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Post('namesofgenre')
  async postGenreOfMovie(
    @Body('name') name: string,
    @Body('enName') enName: string) {
    return await this.rabbitnamesofGenresService.send(
      {
        cmd: 'post-namesgenres',
      },
      {
        name,
        enName
      },
    );
  }
  


  @ApiOperation({summary: 'Добавить название жанра (Пример: {"id":1, "name:"драма","enName":"drame"})'})     //////////////////// CRUD СТРАН
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Post('namesofcountry')
  async postCountry(
    @Body('name') name: string,
    @Body('enName') enName: string) {
    return await this.rabbitnamesofCountriesService.send(
      {
        cmd: 'post-country',
      },
      {
        name,
        enName
      },
    );
  }
  @ApiOperation({summary: 'Изменить название страны (Пример: {"id":1, "name:"Франция","enName":"France"})'})
  @ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
  @Patch('namesofcountry')
  async updateCountriesOfMovie(
    @Body('id') id: number,
    @Body('name') name: string,
    @Body('enName') enName: string) {
    return await this.rabbitnamesofCountriesService.send(
      {
        cmd: 'update-namesofcountry',
      },
      {
        id,
        name,
        enName
      },
    );
  }



  @ApiOperation({summary: 'Получить все страны'}) /////////////////////////////////////
  @ApiTags('Данные с сайта kinopoisk')
  @Get('namesOfCountries')
  async getCountriesNames() {
    return await this.rabbitnamesofCountriesService.send({
      cmd: 'get-all-countries-names',
    },
    {});

  }
  @ApiOperation({summary: 'Получить все сохраненные данные о тех кто учавтсовал в сьемках фильмов данные о которых были получены ранее'})
  @ApiTags('(Суммарные данные) с сайта kinopoisk')
  @Get('personswithinfo')
  async GetAllPersonWithInfo() {
    return await this.rabbitFilmsService.send({
      cmd: 'get-all-persons-with-film-info',
    },
    {});

  } 
  @ApiOperation({summary: 'Получить всю инфомрацию о персоне по id'})
  @ApiTags('(Суммарные данные) с сайта kinopoisk')
  @Get('personswithinfo/:id')
  async getPersonWithAllInfo(
    @Param('id') id: number) {
    return await this.rabbitFilmsService.send(
      {
        cmd: 'get-all-info-personsoffilms-by-personid',
      },
      {id:id},
    );
  }
  @ApiOperation({summary: 'Получить всех режисеров'})
  @ApiTags('Данные с сайта kinopoisk')
  @Get('getAllDirectors')
  async getAllDirectors() {
    return await this.rabbitPersonsFilmsService.send({
      cmd: 'get-all-directors',
    },
    {});

}
@ApiOperation({summary: 'Получить всех актеров'})
@ApiTags('Данные с сайта kinopoisk')
@Get('getAllActors')
async getAllActors() {
  return await this.rabbitPersonsFilmsService.send({
    cmd: 'get-all-actors',
  },
  {});

}
@ApiOperation({summary: 'Авторизация через ВК'})
@ApiTags('auth/vk')
@UseGuards(AuthGuard('vkontakte'))
@Get('auth/vk')
async VKlogin() {}

@Get('auth/vk/redirect')
@UseGuards(AuthGuard('vkontakte'))
async VKloginRedirect(@Req() req, @Res() res) {
    console.log(req.user);
    res.cookie('authenticationType', 'vk', {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    res.cookie('refreshToken', req.user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}).send(req.user.refreshToken);
}

@ApiOperation({summary: 'Авторизация через google'})
@ApiTags('auth/google')
@UseGuards(AuthGuard('google'))
@Get('auth/google')
async googleLogin() {}

@Get('auth/google/redirect')
@UseGuards(AuthGuard('google'))
async googleLoginRedirect(@Req() req, @Res() res) {
    res.cookie('authenticationType', 'google', {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    res.cookie('refreshToken', req.user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}).send(req.user.accessToken);
}
@ApiOperation({summary: 'Выход из аккаунта и очищение cookies'})
@ApiTags('/auth/logout')
@Post('/auth/logout')
async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('authenticationType');
    return {message: "cookies has been cleared"};
}

@ApiOperation({summary: 'Регистрация через email'})
@ApiTags('/auth/registration')
@Post('/auth/registration')
async registration(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.registration(userDto);
    res.cookie('authenticationType', 'email', {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}).send(user.accessToken);
}

@ApiOperation({summary: 'Авторизация через email'})
@ApiTags('/auth/login')
@Post('/auth/login')
async login(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.login(userDto);
    res.cookie('authenticationType', 'email', {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}).send(user.accessToken);
}

@ApiOperation({summary: 'Публикация комментария к фильму'})
@ApiTags('/comment/film')
@Post('/comment/film')
async publishCommentToFilm(@Body('text') commentText: string, @Req() req) {
    const date = String(new Date());
    const email = req.user.email;
    
    const comment = await this.commentService.publishCommentToFilm({date: date, userEmail: email, text: commentText});
    return comment;
}

@ApiOperation({summary: 'Публикация комментария к другому комментарию'})
@ApiTags('/comment/childComment')
@Post('/comment/childComment')
async publishChildComment(@Body() commentInfo: any, @Req() req) {
    const date = String(new Date());
        const email = req.user.email;
        const comment = await this.commentService.publishChildComment({date: date, userEmail: email, text: commentInfo.text,
                                                                         parentId: commentInfo.parentId});
        return comment;
}

@ApiOperation({summary: 'Получить данные комментария'})
@ApiTags('/comment/:id')
@Get('/comment/:id')
    async getComment(@Param() data) {
        const comment = await this.commentService.getComment(data.id);
        return comment;
    }


}
