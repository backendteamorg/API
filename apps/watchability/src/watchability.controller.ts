import { Controller, Get } from '@nestjs/common';
import { WatchabilityService } from './watchability.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class WatchabilityController {
  constructor(private readonly watchabilityService: WatchabilityService) {}
  
  @MessagePattern({ cmd: 'parser-watchability'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.watchabilityService.formDatabase()
  }

  @MessagePattern({ cmd: 'get-watchability-by-moveid' })
  async getWhatchabilityById(
    @Ctx() context: RmqContext,
    @Payload() movie: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.watchabilityService.getWatchabilityByMovieId(movie.id);
  }
}
