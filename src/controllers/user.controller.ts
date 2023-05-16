import { Controller, Get, Post, Body } from '@nestjs/common';
import { IUserDTO, Public } from 'src/interfaces/general';
import { User } from 'src/models/user.entity';
import { UsersService } from '../services/user.service';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
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
