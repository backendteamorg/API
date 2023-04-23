import { Controller, Get } from '@nestjs/common';
import { FactsService } from './facts.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class FactsController {
  constructor(private readonly factsService: FactsService) {}
  @Get()
  @MessagePattern({ cmd: 'parser-facts'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.factsService.formDatabase()
  }
  
}
