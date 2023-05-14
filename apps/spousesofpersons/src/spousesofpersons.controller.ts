import { Controller, Get } from '@nestjs/common';
import { SpousesofpersonsService } from './spousesofpersons.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

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

  @MessagePattern({ cmd: 'get-all-sposes-of-person'})
  async getAllSpousesOfPerson(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.spousesofpersonsService.getSpousesOfPersonId()
  }

  @MessagePattern({ cmd: 'get-spousesofperson-by-id' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() person: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.spousesofpersonsService.getSpousesByPersonId(person.id);
  }
}
