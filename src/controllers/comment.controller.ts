import { Body, Controller, Get, Post } from '@nestjs/common';
import { Category } from 'src/models/category.entity';
import { Color } from 'src/models/color.entity';
import { Comment } from 'src/models/comment.entity';
import { CommentsService } from '../services/comment.service';
import {
  IAPIResponse,
  ICommentCreationDTO,
  IMessageDTO,
} from 'src/interfaces/general';
import { Message } from 'src/models/message.entity';
import { trimAndReturn } from 'src/utils/utils';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getAllComments(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Post('/add')
  async addComment(
    @Body()
    comment: ICommentCreationDTO,
  ): Promise<IAPIResponse> {
    try {
      let newComment = Comment.create({
        content: trimAndReturn(comment.content, 1000),
        userId: comment.userId,
        qpartId: comment.qpartId,
      }).catch((e) => {
        return { code: 500, message: `generic error` };
      });
      if (newComment instanceof Comment) {
        return { code: 200, message: 'success' };
      }
      return { code: 500, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }
}
