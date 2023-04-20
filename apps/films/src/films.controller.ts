import { Controller, Get } from '@nestjs/common';
import { FilmsService } from './films.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  @MessagePattern({ cmd: 'get-films-title'})
  async getFilmsTitle(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return 'FilmsService'
  }
  @Get()
  @MessagePattern({ cmd: 'get-films'})
  async getFilms(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.filmsService.formDatabase()
  }
  @Get()
  @MessagePattern({ cmd: 'get-all-films'})
  async getAllFilms(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.filmsService.getAllFilm()
  }
}
