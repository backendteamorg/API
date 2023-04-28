import { Controller, Get } from '@nestjs/common';
import { NamesoffilmsService } from './namesoffilms.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class NamesoffilmsController {
  constructor(private readonly namesoffilmsService: NamesoffilmsService) {}

  
  @MessagePattern({ cmd: 'parser-namesoffilms'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.namesoffilmsService.formDatabase()
  }

  @MessagePattern({ cmd: 'get-namesOfFilms-by-moveid' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() movie: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.namesoffilmsService.getNamesOfFilmsByMovieId(movie.id);
  }

}
