import { Injectable, Inject } from '@nestjs/common';
import { UserTitle } from '../models/userTitle.entity';
import { IUserTitle } from 'src/interfaces/general';

@Injectable()
export class UsertitlesService {
  constructor(
    @Inject('USERTITLE_REPOSITORY')
    private usertitlesRepository: typeof UserTitle,
  ) {}

  async findAll(): Promise<UserTitle[]> {
    return this.usertitlesRepository.findAll<UserTitle>();
  }

  async findIfExists(data: IUserTitle): Promise<UserTitle | null> {
    const result = await this.usertitlesRepository.findOne({
      where: {
        userId: data.userId,
        titleId: data.titleId,
      },
    });
    return result;
  }
}
