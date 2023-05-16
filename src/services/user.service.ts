import { Injectable, Inject } from '@nestjs/common';
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
  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { name: username },
    });
  }
  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: id },
    });
  }
}
