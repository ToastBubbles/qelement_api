import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IUserDTO, Public } from 'src/interfaces/general';
import { User } from 'src/models/user.entity';
import { UsersService } from '../services/user.service';
import * as bcrypt from 'bcrypt';
import { IQelementError } from 'src/interfaces/error';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/:username')
  async findOneByUsername(
    @Param('username') username: string,
  ): Promise<User | IQelementError> {
    let result = this.usersService.findOneByUsername(username);
    console.log(await result);

    return result;
  }

  @Get('/id/:userid')
  async findOneById(
    @Param('userid') id: number,
  ): Promise<User | IQelementError> {
    let result = this.usersService.findOneById(id);
    console.log(await result);

    return result;
  }

  @Public()
  @Post()
  async registerNewUser(
    @Body()
    userDTO: IUserDTO,
  ) {
    try {
      const salt = await bcrypt.genSalt();

      const hash = await bcrypt.hash(userDTO.password, salt);
      let newUser = new User({
        name: userDTO.name,
        email: userDTO.email,
        password: hash,
        role: userDTO.role,
      });
      newUser.save();
    } catch (error) {
      console.log(error);
    }
  }
}
