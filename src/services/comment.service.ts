import { Injectable, Inject } from '@nestjs/common';
import { Comment } from '../models/comment.entity';
import { IDeletionDTO } from 'src/interfaces/general';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private commentsRepository: typeof Comment,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.findAll<Comment>();
  }

  async findByIdAndUserId(data: IDeletionDTO): Promise<Comment | null> {
    return this.commentsRepository.findOne<Comment>({
      where: {
        id: data.itemToDeleteId,
        userId: data.userId,
      },
    });
  }

  async findById(id: number): Promise<Comment | null> {
    return this.commentsRepository.findOne<Comment>({
      where: {
        id: id,
      },
    });
  }
}
