import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Title } from 'src/models/title.entity';
import { TitlesService } from '../services/title.service';
import { IAPIResponse, ITitle } from 'src/interfaces/general';
import { User } from 'src/models/user.entity';
import { trimAndReturn } from 'src/utils/utils';

@Controller('title')
export class TitlesController {
  constructor(private readonly titlesService: TitlesService) {}

  @Get('/all')
  async getAllTitles(): Promise<Title[]> {
    return this.titlesService.findAll();
  }

  @Post('/add')
  async addNewCategory(
    @Body() data: ITitle,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      if (user.role !== 'admin')
        return { code: 506, message: 'User is not admin' };

      const newTitle = await Title.create({
        title: data.title,
        cssClasses: data.cssClasses,
        requirement:
          data.requirement.trim().length == 0
            ? null
            : trimAndReturn(data.requirement),
        public: data.public,
      });
      await newTitle.save();

      if (newTitle instanceof Title)
        return { code: 200, message: 'Title created' };
      return { code: 507, message: 'Something went wrong' };
    } catch (error) {
      console.log(error);
      return { code: 504, message: `Generic error` };
    }
  }
}
