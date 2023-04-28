import { Controller, Get } from '@nestjs/common';
import { FilmsService } from './films.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

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

    return this.filmsService.formDatabase()
  }
 
  @MessagePattern({ cmd: 'get-all-films'})
  async getAllFilms(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.filmsService.getAllFilm()
  }
  @MessagePattern({ cmd: 'get-film-by-id' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() film: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.filmsService.getFilmById(film.id);
  }
}
