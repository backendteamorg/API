import { Controller, Get } from '@nestjs/common';
import { FactsService } from './facts.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class FactsController {
  constructor(private readonly factsService: FactsService) {}
  
  @MessagePattern({ cmd: 'parser-facts'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.factsService.formDatabase()
  }
  @MessagePattern({ cmd: 'get-all-facts'})
  async getAllCountries(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.factsService.getAllFacts()
  }

  @MessagePattern({ cmd: 'get-facts-by-moveid' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() movie: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.factsService.getFacrsOfFilmByMovieId(movie.id);
  }
  
}
