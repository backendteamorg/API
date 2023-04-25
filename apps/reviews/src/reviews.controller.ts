import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @MessagePattern({ cmd: 'parser-reviews'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.reviewsService.formDatabase()
  }
}
