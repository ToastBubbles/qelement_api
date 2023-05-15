import { Controller, Get, Post, Body } from '@nestjs/common';
import { IUserDTO } from 'src/interfaces/general';
import { User } from 'src/models/user.entity';
import { UsersService } from '../services/user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/add')
  async addTestUser(): Promise<User> {
    let testUser = new User({
      name: 'tester',
      role: 'user',
    });
    testUser.save();
    return testUser;
  }

  @Post()
  async registerNewUser(
    @Body()
    userDTO: IUserDTO,
  ) {
    try {
      let newUser = new User({
        name: userDTO.name,
        email: userDTO.email,
        password: userDTO.password,
        role: userDTO.role,
      });
      newUser.save();
    } catch (error) {
      console.log(error);
    }
  }
}
