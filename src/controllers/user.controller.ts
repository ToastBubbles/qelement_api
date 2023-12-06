import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  IAPIResponse,
  ISuspendUser,
  IUserDTO,
  IUserWSecQDTO,
  Public,
} from 'src/interfaces/general';
import { User } from 'src/models/user.entity';
import { UsersService } from '../services/user.service';
import * as bcrypt from 'bcrypt';
import { IQelementError } from 'src/interfaces/error';
import { SecurityQuestion } from 'src/models/securityQuestion.entity';

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
  ): Promise<User | IAPIResponse> {
    try {
      let result = this.usersService.findOneByUsername(username);

      return result;
    } catch (error) {
      return { code: 500, message: `error` };
    }
  }

  @Get('/id/:userid')
  async findOneById(
    @Param('userid') id: number,
  ): Promise<User | IQelementError> {
    let result = this.usersService.findOneById(id);

    return result;
  }
  @Get('/getQuestions/:email')
  async findOneByEmail(
    @Param('email') email: string,
  ): Promise<User | IQelementError> {
    let result = this.usersService.findOneByEmail(email);

    return result;
  }

  @Get('/checkIfAdmin/:userid')
  async checkIfAdminById(@Param('userid') id: number): Promise<IAPIResponse> {
    let result = await this.usersService.findOneById(id);

    if (result) {
      if (result?.role == 'admin') {
        return { code: 200, message: 'user is admin' };
      } else if (result.role == 'trusted') {
        return { code: 201, message: `user is trusted` };
      } else {
        return { code: 403, message: `user is not admin` };
      }
    } else return { code: 404, message: `user not found` };
  }

  @Public()
  @Post('/recover')
  async RecoverUser(
    @Body()
    userDTO: IUserWSecQDTO,
  ): Promise<IAPIResponse> {
    try {
      if (
        userDTO.q1.questionId == null ||
        userDTO.q2.questionId == null ||
        userDTO.q3.questionId == null ||
        userDTO.q1.answer.length <= 3 ||
        userDTO.q2.answer.length <= 3 ||
        userDTO.q3.answer.length <= 3
      ) {
        return { code: 505, message: `bad security questions` };
      }
      if (userDTO.name.length > 255 || userDTO.email.length > 255) {
        return { code: 500, message: `text OOB` };
      } else {
        const salt = await bcrypt.genSalt();

        const hash = await bcrypt.hash(userDTO.password, salt);
      }
      return { code: 503, message: `failed to create user` };
    } catch (error) {
      console.log(error);
      return { code: 504, message: `failed due to error` };
    }
  }

  @Public()
  @Post()
  async registerNewUser(
    @Body()
    userDTO: IUserWSecQDTO,
  ): Promise<IAPIResponse> {
    try {
      if (
        userDTO.q1.questionId == null ||
        userDTO.q2.questionId == null ||
        userDTO.q3.questionId == null ||
        userDTO.q1.answer.length <= 3 ||
        userDTO.q2.answer.length <= 3 ||
        userDTO.q3.answer.length <= 3
      ) {
        return { code: 505, message: `bad security questions` };
      }
      if (userDTO.name.length > 255 || userDTO.email.length > 255) {
        return { code: 500, message: `text OOB` };
      } else {
        const salt = await bcrypt.genSalt();

        const hash = await bcrypt.hash(userDTO.password, salt);
        const hashA1 = await bcrypt.hash(userDTO.q1.answer.toLowerCase(), salt);
        const hashA2 = await bcrypt.hash(userDTO.q2.answer.toLowerCase(), salt);
        const hashA3 = await bcrypt.hash(userDTO.q3.answer.toLowerCase(), salt);

        const newUser = await User.create({
          name: userDTO.name,
          email: userDTO.email.toLowerCase(),
          password: hash,
          role: userDTO.role,
        }).catch((e) => {
          return { code: 501, message: `generic error` };
        });
        if (newUser instanceof User) {
          const q1 = await SecurityQuestion.create({
            predefinedQuestionId: userDTO.q1.questionId,
            answer: hashA1,
            userId: newUser.id, // Set the userId for the user association
          }).catch((e) => {
            return { code: 501, message: `generic error` };
          });

          const q2 = await SecurityQuestion.create({
            predefinedQuestionId: userDTO.q2.questionId,
            answer: hashA2,
            userId: newUser.id, // Set the userId for the user association
          }).catch((e) => {
            return { code: 501, message: `generic error` };
          });

          const q3 = await SecurityQuestion.create({
            predefinedQuestionId: userDTO.q3.questionId,
            answer: hashA3,
            userId: newUser.id, // Set the userId for the user association
          }).catch((e) => {
            return { code: 501, message: `generic error` };
          });
          let questions: SecurityQuestion[];
          if (
            q1 instanceof SecurityQuestion &&
            q2 instanceof SecurityQuestion &&
            q3 instanceof SecurityQuestion
          ) {
            questions = [q1, q2, q3];
            await newUser.$set('securityQuestions', questions);
            return { code: 200, message: `created!` };
          } else {
            return { code: 501, message: `generic error` };
          }

          // return { code: 200, message: `created!` };
        }

        // newUser.securityQuestions.add

        // let newUser = new User({
        //   name: userDTO.name,
        //   email: userDTO.email,
        //   password: hash,
        //   role: userDTO.role,
        // });
        // newUser.save();
      }
      return { code: 503, message: `failed to create user` };
    } catch (error) {
      console.log(error);
      return { code: 504, message: `failed due to error` };
    }
  }

  @Public()
  @Post('/suspend')
  async suspendUser(
    @Body()
    suspensionDTO: ISuspendUser,
  ): Promise<IAPIResponse> {
    try {
      const admin = await this.usersService.findOneById(suspensionDTO.adminId);

      if (admin.role) {
        const user = await this.usersService.findOneById(suspensionDTO.userId);

        if (user.role == 'admin') {
          return { code: 405, message: 'cannot suspend an admin' };
        }

        if (suspensionDTO.type == 'ban') {
          await user.update({
            role: 'banned',
            suspentionReason: suspensionDTO.reason,
          });
          return { code: 200, message: 'successfully banned' };
        } else if (suspensionDTO.type == 'suspension') {
          await user.update({
            role: 'suspended',
            suspendedDate: suspensionDTO.untilDate,
            suspentionReason: suspensionDTO.reason,
          });
          return { code: 200, message: 'successfully banned' };
        } else if (suspensionDTO.type == 'ban removal') {
          await user.update({
            role: 'user',
          });
          return { code: 200, message: 'successfully banned' };
        }
        return { code: 500, message: 'nothing changed' };
      } else {
        return { code: 404, message: 'Not presented with correct creds' };
      }
    } catch (error) {
      console.log(error);
      return { code: 504, message: `failed due to error` };
    }
  }
}
