import { Controller, Get } from '@nestjs/common';
import { FilmsService } from './films.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FilmDto } from './dto/film.dto';
import { FilteDto } from './dto/filtre.dto';

@Controller()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  
  

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

  @MessagePattern({ cmd: 'get-movies-by-director' })
  async getMoviesByDirector(
    @Ctx() context: RmqContext,
    @Payload() director: {director:string}, ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.filmsService.getFilmsByDirector(director.director);
  
  }

  @MessagePattern({ cmd: 'get-movies-by-actor' })
  async getMoviesByActor(
    @Ctx() context: RmqContext,
    @Payload() actor: {actor:string}, ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.filmsService.getFilmsByActor(actor.actor);
  
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

  @MessagePattern({ cmd: 'get-film-by-rating-kp' })
  async getMoviesByRatingKp(
    @Ctx() context: RmqContext,
    @Payload() film: { rating: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.getMoviesByRatingKp(film.rating);
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
  @MessagePattern({ cmd: 'esli-vam-ponravilsa-film' })
  async eSLIWamPonravilsaEtotFilm(
    @Ctx() context: RmqContext,
    @Payload() film: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.filmsService.eSLIWamPonravilsaEtotFilm(film.id);
  }
  


  @MessagePattern({ cmd: 'get-films-use-filtres' })
  async register(
    @Ctx() context: RmqContext, 
    @Payload() queryParams: any) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.filmsService.getFilmsUseFiltre(queryParams);
  }

  

 
}
