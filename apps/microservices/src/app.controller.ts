import { Controller, Get,Inject,Post,Body, UseGuards, Put,Param ,Delete, Patch, Req,Query} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ApiCreatedResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IsEmail, IsString } from 'class-validator';

import { FilteDto } from 'apps/films/src/dto/filtre.dto';



@Controller()
export class AppController {
  constructor(
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
  @ApiOperation({summary: 'Сделать запрос к api на информацию о странах фильмов данные о которых были получены ранее'})
  @ApiTags('Данные с api kinopoisk')
  @Get('admin/countriesNames/parsing')
  async countriesNamesParser() {
    return await this.rabbitnamesofCountriesService.send({
      cmd: 'parser-countries-names',
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
@ApiOperation({summary: 'Очистить страны после удаления фильма'})
@ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
@Get('clearCountries')
async clearCountries() {
  return await this.rabbitCountriesFilmsService.send({
    cmd: 'clear-countries',
  },
  {});

}
@ApiOperation({summary: 'Очистить жанры после удаления фильма'})
@ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
@Get('clearGenres')
async clearGenres() {
  return await this.rabbitGenresFilmsService.send({
    cmd: 'clear-genres',
  },
  {});

}
@ApiOperation({summary: 'Очистить персоны после удаления фильма'})
@ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
@Get('clearPersons')
async clearPersons() {
  return await this.rabbitPersonsFilmsService.send({
    cmd: 'clear-persons',
  },
  {});

}
@ApiOperation({summary: 'Очистить видео после удаления фильма'})
@ApiTags('(Редактирвоание данных) Данные с сайта kinopoisk')
@Get('clearVideos')
async clearVideos() {
  return await this.rabbitVideosService.send({
    cmd: 'clear-videos',
  },
  {});

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
}
