import { Controller, Get } from '@nestjs/common';
import { NamesoffilmsService } from './namesoffilms.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class NamesoffilmsController {
  constructor(private readonly namesoffilmsService: NamesoffilmsService) {}

  @Get()
  @MessagePattern({ cmd: 'parser-namesoffilms'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.namesoffilmsService.formDatabase()
  }
}
