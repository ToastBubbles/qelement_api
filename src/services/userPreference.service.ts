import { Injectable, Inject, HttpException } from '@nestjs/common';
import { UserPreference } from '../models/userPreference.entity';

@Injectable()
export class UserPreferencesService {
  constructor(
    @Inject('USERPREFERENCE_REPOSITORY')
    private userPreferencesRepository: typeof UserPreference,
  ) {}

  async findAll(): Promise<UserPreference[]> {
    return this.userPreferencesRepository.findAll<UserPreference>();
  }
  async findOneById(id: number): Promise<UserPreference> {
    let foundUserPref = await this.userPreferencesRepository.findOne({
      where: { id: id },
    });
    if (foundUserPref) return foundUserPref;
    else throw new HttpException('User not found', 404);
  }
  async findOneByUserId(userId: number): Promise<UserPreference> {
    let foundUserPref = await this.userPreferencesRepository.findOne({
      where: { userId: userId },
    });
    if (foundUserPref) return foundUserPref;
    else throw new HttpException('User not found', 404);
  }
}
