import { Controller, Get, Req} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Request } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @MessagePattern('publish.comment.film')
  async createComment(@Payload() data: any) {
    const comment = await this.commentService.createComment(data);
    return comment;
  }

  @MessagePattern('publish.comment.child')
  async createChildComment(@Payload() data: any) {
    const comment = await this.commentService.createChildComment(data);
    return comment;
  }

  @MessagePattern('get.comment.byId')
  async getComment(@Payload() id: number) {
    return await this.commentService.getComment(id);
  }
}