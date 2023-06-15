import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IAPIResponse, IUserDTO, Public } from 'src/interfaces/general';
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

  @Get('/checkInsensitive/:username')
  async findOneByUsernameInsensitive(
    @Param('username') username: string,
  ): Promise<IAPIResponse> {
    return this.usersService.findOneByUsernameInsensitive(username);
  }

  @Get('/username/:username')
  async findOneByUsername(
    @Param('username') username: string,
  ): Promise<User | IQelementError> {
    let result = this.usersService.findOneByUsername(username);

    return result;
  }

  @Get('/id/:userid')
  async findOneById(
    @Param('userid') id: number,
  ): Promise<User | IQelementError> {
    let result = this.usersService.findOneById(id);

    return result;
  }

  @Get('/checkIfAdmin/:userid')
  async checkIfAdminById(@Param('userid') id: number): Promise<IAPIResponse> {
    let result = await this.usersService.findOneById(id);

    if (result) {
      if (result?.role == 'admin') {
        return { code: 200, message: 'user is admin' };
      } else {
        return { code: 403, message: `user is not admin` };
      }
    } else return { code: 404, message: `user not found` };
  }

  @Public()
  @Post()
  async registerNewUser(
    @Body()
    userDTO: IUserDTO,
  ) {
    try {
      if (userDTO.name.length > 255 || userDTO.email.length > 255) {
        return;
      } else {
        const salt = await bcrypt.genSalt();

        const hash = await bcrypt.hash(userDTO.password, salt);
        let newUser = new User({
          name: userDTO.name,
          email: userDTO.email,
          password: hash,
          role: userDTO.role,
        });
        newUser.save();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
