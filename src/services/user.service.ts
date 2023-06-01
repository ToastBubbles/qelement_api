import { Injectable, Inject, HttpException } from '@nestjs/common';
import { IQelementError } from 'src/interfaces/error';
import { User } from '../models/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll<User>();
  }
  async findOneByUsername(username: string): Promise<User | IQelementError> {
    let foundUser = await this.usersRepository.findOne({
      where: { name: username },
    });
    if (foundUser) return foundUser;
    let error = { message: 'not found' } as IQelementError;
    return error;
    // throw new HttpException('User not found', 404);
  }
  async findOneById(id: number): Promise<User | IQelementError> {
    let foundUser = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (foundUser) return foundUser;
    let error = { message: 'not found' } as IQelementError;
    return error;
  }
}
