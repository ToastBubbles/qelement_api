import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Category } from 'src/models/category.entity';
import { Color } from 'src/models/color.entity';
import { Comment } from 'src/models/comment.entity';
import { CommentsService } from '../services/comment.service';
import {
  IAPIResponse,
  ICommentCreationDTO,
  IDeletionDTO,
  IIdAndNumber,
  IIdAndString,
} from 'src/interfaces/general';
import { Message } from 'src/models/message.entity';
import { trimAndReturn } from 'src/utils/utils';
import { UsersService } from 'src/services/user.service';
import { User } from 'src/models/user.entity';

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
      if (
        !(comment.partId && comment.partId > 0) &&
        !(comment.qpartId && comment.qpartId > 0) &&
        !(comment.sculptureId && comment.sculptureId > 0)
      ) {
        return { code: 509, message: 'No valid ID found!' };
      }
      let newComment = Comment.create({
        content: trimAndReturn(comment.content, 1000),
        userId: comment.userId,
        qpartId: comment.qpartId ? comment.qpartId : null,
        sculptureId: comment.sculptureId ? comment.sculptureId : null,
        partId: comment.partId ? comment.partId : null,
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

  @Post('/edit')
  async editComment(
    @Body()
    data: IIdAndString,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };

      const itemToEdit = await this.commentsService.findById(data.id);

      if (itemToEdit) {
        if (itemToEdit.userId != userId)
          return { code: 403, message: 'unauthorized, id mismatch' };

        await itemToEdit.update({
          content: trimAndReturn(data.string, 1000),
          edited: true,
        });
        await itemToEdit.save();

        return { code: 200, message: 'success' };
      }

      return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 501, message: error };
    }
  }
}
