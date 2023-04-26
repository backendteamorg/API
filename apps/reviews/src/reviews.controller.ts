import { Controller, Get ,Post} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ReviewsOfMoviesDto } from './dto/reviews.dto';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  
  @Post()
  @MessagePattern({ cmd: 'post-review' })
  async register(@Ctx() context: RmqContext, @Payload() review: ReviewsOfMoviesDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.reviewsService.postReviews(review);
  }
}