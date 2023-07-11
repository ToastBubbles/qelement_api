import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserGoal } from 'src/models/userGoal.entity';
import { UserGoalsService } from '../services/userGoal.service';
import { IAPIResponse, IGoalDTO } from 'src/interfaces/general';
import { trimAndReturn } from 'src/utils/utils';

@Controller('userGoal')
export class UserGoalsController {
  constructor(private readonly userGoalsService: UserGoalsService) {}

  @Get()
  async getAllUserGoals(): Promise<UserGoal[]> {
    return this.userGoalsService.findAll();
  }

  @Get('/id/:userId')
  async getUserGoals(@Param('userId') userId: number): Promise<UserGoal[]> {
    return this.userGoalsService.findAllByUserId(userId);
  }

  @Post('/add')
  async addGoal(
    @Body()
    goalDTO: IGoalDTO,
  ): Promise<IAPIResponse> {
    try {
      let failed = false;
      let newGoal = await UserGoal.create({
        includeSolid: goalDTO.solid,
        includeTrans: goalDTO.trans,
        includeOther: goalDTO.other,
        includeKnown: goalDTO.known,
        name: trimAndReturn(goalDTO.name, 100),
        userId: goalDTO.userId,
        partId: goalDTO.partId,
        partMoldId: goalDTO.moldId == -1 ? null : goalDTO.moldId,
      }).catch((e) => {
        failed = true;
      });

      if (newGoal instanceof UserGoal) {
        return { code: 200, message: 'success' };
      }
      if (failed) {
        return { code: 501, message: 'failed' };
      }
      return { code: 500, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }
}
