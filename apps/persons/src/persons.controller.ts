import { Controller, Get } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}
  
  @MessagePattern({ cmd: 'parser-persons'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.personsService.formDatabase()
  }
  
  @MessagePattern({ cmd: 'get-all-persons'})
  async getAllPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.personsService.getAllPersons()
  }

  @MessagePattern({ cmd: 'get-personsoffilms-by-moveid' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() movie: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.personsService.getPersonsOfMovieByMovieId(movie.id);
  }
}
