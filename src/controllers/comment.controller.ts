import { Controller, Get } from '@nestjs/common';
import { Category } from 'src/models/category.entity';
import { Color } from 'src/models/color.entity';
import { Comment } from 'src/models/comment.entity';
import { CommentsService } from '../services/comment.service';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getAllComments(): Promise<Comment[]> {
    doRun();
    return this.commentsService.findAll();
  }
}

function doRun() {
  const category = Category.build({ name: 'Plate' });

  // Color.create({bl_name: "Orange", tl})
  category.save();
}
