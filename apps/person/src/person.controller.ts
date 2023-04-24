import { Controller, Get } from '@nestjs/common';
import { PersonService } from './person.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}
  @Get()
  @MessagePattern({ cmd: 'parser-person'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.personService.formDatabase()
  }
 
}
