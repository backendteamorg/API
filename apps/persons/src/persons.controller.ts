import { Controller, Get } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}
  @Get()
  @MessagePattern({ cmd: 'parser-persons'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.personsService.formDatabase()
  }

}
