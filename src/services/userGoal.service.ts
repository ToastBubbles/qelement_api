import { Injectable, Inject } from '@nestjs/common';
import { UserGoal } from '../models/userGoal.entity';
import { Part } from 'src/models/part.entity';
import { PartMold } from 'src/models/partMold.entity';
import { QPart } from 'src/models/qPart.entity';
import { Color } from 'src/models/color.entity';

@Injectable()
export class UserGoalsService {
  constructor(
    @Inject('USERGOAL_REPOSITORY')
    private userGoalsRepository: typeof UserGoal,
  ) {}

  async findAll(): Promise<UserGoal[]> {
    return this.userGoalsRepository.findAll<UserGoal>();
  }

  async findAllByUserId(userId: number): Promise<UserGoal[]> {
    console.log(userId);

    return this.userGoalsRepository.findAll<UserGoal>({
      include: [
        {
          model: Part,
          include: [
            {
              model: PartMold,
              include: [{ model: QPart, include: [Color] }],
            },
          ],
          required: true,
          duplicating: false,
        },
      ],
      where: { userId: userId },
    });
  }
}
