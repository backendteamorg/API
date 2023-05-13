import { Controller, Get } from '@nestjs/common';
import { FilmsService } from './films.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FilmDto } from './dto/film.dto';

@Controller()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  
  @MessagePattern({ cmd: 'get-films-title'})
  async getFilmsTitle(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return 'FilmsService'
  }

  @MessagePattern({ cmd: 'parser-films'})
  async getFilms(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.formDatabase()
  }
 
 

  @MessagePattern({ cmd: 'get-all-films-with-info'})
  async getAllFilmsWithInfo(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.getAllFilmsWithAllInfo()
  }

  @MessagePattern({ cmd: 'get-all-films'})
  async getAllFilms(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.getAllFilms()
  }

  @MessagePattern({ cmd: 'get-film-by-id' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() film: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.getFilmById(film.id);
  }

  @MessagePattern({ cmd: 'update-nameoffilm' })
  async UpdateDprofile(
    @Ctx() context: RmqContext,
    @Payload() film: FilmDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.updateNameMovie(film);
  }

  @MessagePattern({ cmd: 'get-film-by-rating' })
  async getMoviesByRating(
    @Ctx() context: RmqContext,
    @Payload() film: { rating: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.getMoviesByRating(film.rating);
  }
  @MessagePattern({ cmd: 'get-film-by-votesKinopoisk' })
  async getMoviesByVotesKp(
    @Ctx() context: RmqContext,
    @Payload() film: { voteskp: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.getMoviesByVotesKinopoisk(film.voteskp);
  }

  @MessagePattern({ cmd: 'get-all-films-sort-votes-kp'})
  async getAllFilmsSortByVotesKp(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.SortByVotesKp()
  }

  @MessagePattern({ cmd: 'get-all-films-sort-rating-kp'})
  async getAllFilmsSortByRatingKp(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.SortByRatingKp()
  }

  @MessagePattern({ cmd: 'get-all-films-sort-date'})
  async getAllFilmsSortByYear(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.SortByDate()
  }

  @MessagePattern({ cmd: 'get-all-films-sort-by-name'})
  async getAllFilmsSortByName(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.SortByName()
  }
}
