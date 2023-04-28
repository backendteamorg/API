import { Controller, Get } from '@nestjs/common';
import { PersonService } from './person.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}
  
  @MessagePattern({ cmd: 'parser-person'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.personService.formDatabase()
  }
  
  @MessagePattern({ cmd: 'get-all-person-profile'})
  async getPerson(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.personService.getAllPersonProfile()
  }

  @MessagePattern({ cmd: 'get-person-by-id' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() person: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.personService.getPersonById(person.id);
  }
 
}
