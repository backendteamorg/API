import { Controller, Get } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class GenresController {
  constructor(private readonly genresService: GenresService) {}
  @Get()
  @MessagePattern({ cmd: 'parser-genres'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.genresService.formDatabase()
  }
  @Get()
  @MessagePattern({ cmd: 'get-all-genres'})
  async getAllCountries(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.genresService.formDatabase()
  }

  @MessagePattern({ cmd: 'get-genres-by-moveid' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() movie: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.genresService.getGenresByMovieId(movie.id);
  }

  
}
