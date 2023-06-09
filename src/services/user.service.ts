import { Injectable, Inject, HttpException } from '@nestjs/common';
import { IQelementError } from 'src/interfaces/error';
import { User } from '../models/user.entity';
import { Op, Sequelize } from 'sequelize';
import { IAPIResponse } from 'src/interfaces/general';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll<User>();
  }
  async findOneByUsername(username: string): Promise<User> {
    let foundUser = await this.usersRepository.findOne({
      where: { name: username },
    });
    if (foundUser) return foundUser;
    else throw new HttpException('User not found', 404);
  }
  async findOneByUsernameInsensitive(username: string): Promise<IAPIResponse> {
    let foundUser = await this.usersRepository.findOne({
      where: {
        name: {
          [Op.iLike]: username,
        },
      },
    });
    if (foundUser) return { code: 200, message: `username is being used` };
    else return { code: 404, message: `username not being used` };
  }
  async findOneById(id: number): Promise<User> {
    let foundUser = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (foundUser) return foundUser;
    else throw new HttpException('User not found', 404);
  }
}
