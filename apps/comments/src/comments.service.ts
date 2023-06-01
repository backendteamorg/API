import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comments.model';
import { CreateChildComment } from './dto/childComment.dto';
import { CreateCommentDto } from './dto/comment.dto';


@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment) private commentRepo: typeof Comment) {}

    async createComment(dto: CreateCommentDto) {
        const comment = await this.commentRepo.create(dto);
        return comment;
    }

    async createChildComment(dto: CreateChildComment) {
        const parentComment = await this.commentRepo.findOne({where: {id: dto.parentId}});
        const comment = await this.commentRepo.create({userEmail: dto.userEmail, text: dto.text, date: dto.date});
        comment.$set('parent', [parentComment.id]);
        comment.parent = parentComment;
        return comment;
    }

    async getComment(id: number) {
        return await this.commentRepo.findOne({where: {id: id}, include: {all: true}});
    }
}