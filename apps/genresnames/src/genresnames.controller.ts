import { Controller, Get } from '@nestjs/common';
import { GenresnamesService } from './genresnames.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { GenresNamesDto } from './dto/genresnames.dto';

@Controller()
export class GenresnamesController {
  constructor(private readonly genresnamesService: GenresnamesService) {}

  @MessagePattern({ cmd: 'parser-namesofgenres'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.genresnamesService.formDatabase()
  }

  @MessagePattern({ cmd: 'get-namesofgenres'})
  async getGetNamesofgenres(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.genresnamesService.getAllnamesGenres()
  }

  @MessagePattern({ cmd: 'update-namesgenres' })
  async UpdateDprofile(
    @Ctx() context: RmqContext,
    @Payload() genre: GenresNamesDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.genresnamesService.updateGenre(genre);
  }

  @MessagePattern({ cmd: 'get-movies-by-genre' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() genre: {genre:string}, ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.genresnamesService.getMoviesByGenre(genre.genre);
  
  }
}
