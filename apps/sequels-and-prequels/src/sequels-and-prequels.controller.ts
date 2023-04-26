import { Controller, Get } from '@nestjs/common';
import { SequelsAndPrequelsService } from './sequels-and-prequels.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

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
}
