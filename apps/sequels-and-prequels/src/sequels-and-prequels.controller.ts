import { Controller, Get } from '@nestjs/common';
import { SequelsAndPrequelsService } from './sequels-and-prequels.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class SequelsAndPrequelsController {
  constructor(private readonly sequelsAndPrequelsService: SequelsAndPrequelsService) {}
  
  @MessagePattern({ cmd: 'sequelsandprequels-parsing'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.sequelsAndPrequelsService.formDatabase()
  }

  @MessagePattern({ cmd: 'get-sequelsAndPrequels-by-moveid' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() movie: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.sequelsAndPrequelsService.getSequelsAndPrequelsByMovieId(movie.id);
  }
}
