import { Body, Controller, Get, Post } from '@nestjs/common';
import { Category } from 'src/models/category.entity';
import { Color } from 'src/models/color.entity';
import { Comment } from 'src/models/comment.entity';
import { CommentsService } from '../services/comment.service';
import {
  IAPIResponse,
  ICommentCreationDTO,
  IDeletionDTO,
} from 'src/interfaces/general';
import { Message } from 'src/models/message.entity';
import { trimAndReturn } from 'src/utils/utils';
import { UsersService } from 'src/services/user.service';

@Controller('comment')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

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
        qpartId: comment.qpartId ? comment.qpartId : null,
        sculptureId: comment.sculptureId ? comment.sculptureId : null,
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

  @Post('/remove')
  async removeComment(
    @Body()
    deletionDTO: IDeletionDTO,
  ): Promise<IAPIResponse> {
    try {
      const itemToRemove = await this.commentsService.findById(
        deletionDTO.itemToDeleteId,
      );
      const requester = await this.usersService.findOneById(deletionDTO.userId);
      if (itemToRemove) {
        if (
          itemToRemove.userId == deletionDTO.userId ||
          requester.role == 'admin'
        ) {
          itemToRemove.destroy();
          return { code: 200, message: `deleted` };
        } else return { code: 502, message: `Incorrect Privs` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 501, message: error };
    }
  }
}
