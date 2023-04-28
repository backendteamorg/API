import { Controller, Get } from '@nestjs/common';
import { SpokenLanguagesService } from './spoken-languages.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class SpokenLanguagesController {
  constructor(private readonly spokenLanguagesService: SpokenLanguagesService) {}

  
  @MessagePattern({ cmd: 'spoken-langeage-parser'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.spokenLanguagesService.formDatabase()
  }

  @MessagePattern({ cmd: 'get-spokenLanguages-by-moveid' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() movie: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.spokenLanguagesService.getSpokenLanguagesByMovieId(movie.id);
  }
}
