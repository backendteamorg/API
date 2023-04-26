import { Controller, Get } from '@nestjs/common';
import { SpousesofpersonsService } from './spousesofpersons.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class SpousesofpersonsController {
  constructor(private readonly spousesofpersonsService: SpousesofpersonsService) {}

  @MessagePattern({ cmd: 'sposes-of-person-parser'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.spousesofpersonsService.formDatabase()
  }
}
