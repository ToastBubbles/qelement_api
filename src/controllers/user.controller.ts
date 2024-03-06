import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import {
  IAPIResponse,
  IChangeUserRole,
  ISuspendUser,
  IUserDTO,
  IUserWSecQDTO,
  Public,
  iIdOnly,
} from 'src/interfaces/general';
import { User } from 'src/models/user.entity';
import { UsersService } from '../services/user.service';
import * as bcrypt from 'bcrypt';
import { IQelementError } from 'src/interfaces/error';
import { SecurityQuestion } from 'src/models/securityQuestion.entity';
import { UserPreference } from 'src/models/userPreference.entity';
import { ColorsService } from 'src/services/color.service';
import { Color } from 'src/models/color.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/checkInsensitive/:username')
  async findUserByUsernameInsensitive(
    @Param('username') username: string,
  ): Promise<IAPIResponse> {
    return this.usersService.findOneByUsernameInsensitive(username);
  }

  @Get('/username/:username')
  async findUserByUsername(
    @Param('username') username: string,
  ): Promise<User | IAPIResponse> {
    try {
      let result = this.usersService.findOneByUsername(username.trim());

      return result;
    } catch (error) {
      return { code: 500, message: `error` };
    }
  }

  @Get('/email/:email')
  async findUserByEmail(
    @Param('email') email: string,
  ): Promise<User | IAPIResponse> {
    try {
      let result = this.usersService.findOneByEmail(email.trim(), false);

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
  async findUserByEmailWithSecurityQuestions(
    @Param('email') email: string,
  ): Promise<User | IQelementError> {
    let result = this.usersService.findOneByEmail(email, true);

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
  @Post('/changeTitle')
  async UpdateUserTitle(
    @Body()
    { id }: iIdOnly,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      if (id <= 0) return { code: 509, message: `bad ID` };
      const userId = req.user.id;
      if (!userId) return { code: 403, message: `user ID not validated` };
      const user = await this.usersService.findOneById(userId);
      if (!user) return { code: 504, message: `could not find user` };
      const color = await Color.findByPk(id);
      if (!color) return { code: 505, message: `could not find color` };

      if (!user.titles.find((x) => x.id == id))
        return {
          code: 508,
          message: `invalid selection, user does not own this title!`,
        };

      await user.update({
        selectedTitleId: id,
      });
      await user.save();

      return { code: 200, message: `title updated!` };
    } catch (error) {
      console.log(error);
      return { code: 504, message: `failed due to error` };
    }
  }

  @Public()
  @Post('/favoriteColor')
  async UpdateFavoriteColor(
    @Body()
    { id }: iIdOnly,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;

      if (!userId) return { code: 403, message: `user ID not validated` };

      const user = await this.usersService.findOneById(userId);
      if (!user) return { code: 504, message: `could not find user` };
      const color = await Color.findByPk(id);
      if (!color) return { code: 505, message: `could not find color` };

      await user.update({
        favoriteColorId: id,
      });
      await user.save();

      return { code: 200, message: `favorite color updated!` };
    } catch (error) {
      console.log(error);
      return { code: 504, message: `failed due to error` };
    }
  }

  @Public()
  @Post('/register')
  async registerNewUser(
    @Body()
    userDTO: IUserWSecQDTO,
  ): Promise<IAPIResponse> {
    try {
      const isValidUsername = (input: string): boolean => {
        return /^[a-zA-Z0-9._]+$/.test(input);
      };
      const username = userDTO.name.trim();

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
      if (!isValidUsername(username))
        return { code: 503, message: 'username must only contain a-z A-Z 0-9' };
      if (userDTO.name.length > 255 || userDTO.email.length > 255) {
        return { code: 500, message: `text OOB` };
      } else {
        const salt = await bcrypt.genSalt();

        const hash = await bcrypt.hash(userDTO.password, salt);
        const hashA1 = await bcrypt.hash(userDTO.q1.answer.toLowerCase(), salt);
        const hashA2 = await bcrypt.hash(userDTO.q2.answer.toLowerCase(), salt);
        const hashA3 = await bcrypt.hash(userDTO.q3.answer.toLowerCase(), salt);

        let badColor: boolean = false;
        if (userDTO.favoriteColorId) {
          const color = await Color.findByPk(userDTO.favoriteColorId);
          if (!color) badColor = true;
        }

        const newUser = await User.create({
          name: username,
          email: userDTO.email.trim().toLowerCase(),
          password: hash,
          role: 'user',
          favoriteColorId: !badColor ? userDTO.favoriteColorId : null,
        })
        if (newUser instanceof User) {
          const q1 = await SecurityQuestion.create({
            predefinedQuestionId: userDTO.q1.questionId,
            answer: hashA1,
            userId: newUser.id, // Set the userId for the user association
          })

          const q2 = await SecurityQuestion.create({
            predefinedQuestionId: userDTO.q2.questionId,
            answer: hashA2,
            userId: newUser.id, // Set the userId for the user association
          })

          const q3 = await SecurityQuestion.create({
            predefinedQuestionId: userDTO.q3.questionId,
            answer: hashA3,
            userId: newUser.id, // Set the userId for the user association
          })
          let questions: SecurityQuestion[];
          if (
            q1 instanceof SecurityQuestion &&
            q2 instanceof SecurityQuestion &&
            q3 instanceof SecurityQuestion
          ) {
            questions = [q1, q2, q3];
            await newUser.$set('securityQuestions', questions);
            // const prefs = await UserPreference.create({
            //   userId: newUser.id,
            // });
            // await newUser.$set('preferences', prefs);
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

      if (admin) {
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

  @Public()
  @Post('/newRole')
  async changeUserRole(
    @Body()
    roleChangeDTO: IChangeUserRole,
  ): Promise<IAPIResponse> {
    try {
      console.log(roleChangeDTO);

      const admin = await this.usersService.findOneById(roleChangeDTO.adminId);

      if (admin) {
        const user = await this.usersService.findOneById(roleChangeDTO.userId);

        if (user.role == roleChangeDTO.newRole) {
          return { code: 405, message: 'new role is same as old role' };
        }

        user.update({
          role: roleChangeDTO.newRole,
        });
        user.save();
        return { code: 200, message: 'Role updated!' };
      } else {
        return { code: 404, message: 'Not presented with correct creds' };
      }
    } catch (error) {
      console.log(error);
      return { code: 504, message: `failed due to error` };
    }
  }
}
