import { Controller, Get ,Post} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  
  @Get()
  @MessagePattern({ cmd: 'post-reviews'})
  async postReview(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.reviewsService.postReviews()
  }
}
