import { Controller, Get } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class VideosController {
  constructor(private readonly videosService: VideosService) {}
  
  @Get()
  @MessagePattern({ cmd: 'videos-parser'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.videosService.formDatabase()
  }
 
}
