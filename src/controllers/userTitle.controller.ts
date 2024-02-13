import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserTitle } from 'src/models/userTitle.entity';
import { UsertitlesService } from '../services/userTitle.service';
import { IAPIResponse, IUserTitlePackedDTO } from 'src/interfaces/general';
import { User } from 'src/models/user.entity';

@Controller('userTitle')
export class UsertitlesController {
  constructor(private readonly usertitlesService: UsertitlesService) {}

  @Get()
  async getAllUsertitles(): Promise<UserTitle[]> {
    return this.usertitlesService.findAll();
  }

  @Post('/add')
  async addTitlesToUsers(
    @Body() data: IUserTitlePackedDTO,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      if (user.role !== 'admin')
        return { code: 506, message: 'User is not admin' };

      const createdUserTitles: UserTitle[] = [];
      const createdUserTitleIds: number[] = [];
      let didMiss = false;
      for (const userTitle of data.array) {
        const newUserTitle = await this.createUserTitle(
          userTitle.user.id,
          userTitle.title.id,
        );

        if (newUserTitle instanceof UserTitle) {
          createdUserTitles.push(newUserTitle);
          createdUserTitleIds.push(newUserTitle.id);
        } else {
          didMiss = true;
        }
      }
      if (didMiss) {
        return { code: 509, message: 'error adding one or more user title' };
      }

      if (createdUserTitles.length > 0) {
        return {
          code: 201,
          message: 'added',
        };
      } else {
        return {
          code: 500,
          message: 'All userTitles already exist or generic error',
        };
      }
    } catch (error) {
      console.log(error);
      return { code: 504, message: `Generic error` };
    }
  }

  private async createUserTitle(
    userId: number,
    titleId: number,
  ): Promise<UserTitle | null> {
    try {
      const existingPart = await this.usertitlesService.findIfExists({
        userId: userId,
        titleId: titleId,
      });

      if (existingPart) {
        return null;
      }

      const newUserTitle = await UserTitle.create({
        userId,
        titleId,
      });

      return newUserTitle;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
