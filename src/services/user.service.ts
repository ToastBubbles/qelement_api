import { Injectable, Inject, HttpException } from '@nestjs/common';
import { IQelementError } from 'src/interfaces/error';
import { User } from '../models/user.entity';
import { Op, Sequelize } from 'sequelize';
import { IAPIResponse } from 'src/interfaces/general';
import { SecurityQuestion } from 'src/models/securityQuestion.entity';
import { PredefinedSecurityQuestion } from 'src/models/predefinedSecurityQuestion.entity';
import { UserPreference } from 'src/models/userPreference.entity';
import { QPart } from 'src/models/qPart.entity';
import { Color } from 'src/models/color.entity';
import { Image } from 'src/models/image.entity';
import { ElementID } from 'src/models/elementID.entity';
import { PartMold } from 'src/models/partMold.entity';
import { Part } from 'src/models/part.entity';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { PartStatus } from 'src/models/partStatus.entity';
import { Title } from 'src/models/title.entity';
import { SubmissionCount } from 'src/models/submissionCount.entity';
import { Notification } from 'src/models/notification.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll<User>();
  }
  async findOneByUsername(username: string): Promise<User | IAPIResponse> {
    try {
      let foundUser = await this.usersRepository.findOne({
        where: { name: username },
        include: [UserPreference, Color, SubmissionCount],
      });
      if (!foundUser) return { code: 404, message: `user not found` };

      // Check user's preferences
      const isCollectionVisible = foundUser.preferences?.isCollectionVisible;
      const isWantedVisible = foundUser.preferences?.isWantedVisible;
      // Include if true
      if (isCollectionVisible) {
        // Explicitly specify the return type as an array of QPart instances
        const inventory = await foundUser.$get('inventory', {
          include: [
            {
              model: ElementID,
              where: {
                approvalDate: {
                  [Op.ne]: null,
                },
              },
              required: false,
            },
            { model: PartMold, include: [Part] },
            Color,
            { model: User, as: 'creator' },
            RaretyRating,
            {
              model: PartStatus,
              where: {
                approvalDate: {
                  [Op.ne]: null,
                },
              },
              required: false,
            },
            {
              model: Image,
              include: [{ model: User, as: 'uploader' }],
            },
          ],
        });
        foundUser.setDataValue('inventory', inventory);
      } else {
        // If not visible, remove inventory from the result
        foundUser.setDataValue('inventory', undefined);
      }
      if (isWantedVisible) {
        // Explicitly specify the return type as an array of QPart instances
        const favoriteQParts = await foundUser.$get('favoriteQParts', {
          include: [
            {
              model: ElementID,
              where: {
                approvalDate: {
                  [Op.ne]: null,
                },
              },
              required: false,
            },
            { model: PartMold, include: [Part] },
            Color,
            { model: User, as: 'creator' },
            RaretyRating,
            {
              model: PartStatus,
              where: {
                approvalDate: {
                  [Op.ne]: null,
                },
              },
              required: false,
            },
            {
              model: Image,
              include: [{ model: User, as: 'uploader' }],
            },
          ],
        });
        foundUser.setDataValue('favoriteQParts', favoriteQParts);
      } else {
        // If not visible, remove favoriteQParts from the result
        foundUser.setDataValue('favoriteQParts', undefined);
      }

      return foundUser;
    } catch (error) {
      console.error('Error finding user:', error);
      return { code: 500, message: `Internal server error` };
    }
  }
  async findOneByEmail(
    email: string,
    includeSecurityQuestions: boolean = false,
  ): Promise<User | IAPIResponse> {
    let foundUser = await this.usersRepository.findOne({
      include: [UserPreference],
      where: { email: email },
    });

    if (foundUser && includeSecurityQuestions) {
      // Explicitly specify the return type as an array of QPart instances
      const securityQuestions = await foundUser.$get('securityQuestions', {
        include: [
          {
            model: SecurityQuestion,
            as: 'securityQuestions',
            include: [PredefinedSecurityQuestion],
          },
        ],
      });
      foundUser.setDataValue('securityQuestions', securityQuestions);
    }

    if (foundUser) return foundUser;
    else return { code: 404, message: `user not found` };
  }
  async findOneByUsernameInsensitive(username: string): Promise<IAPIResponse> {
    let foundUser = await this.usersRepository.findOne({
      where: {
        name: {
          [Op.iLike]: username,
        },
      },
      include: [UserPreference],
    });
    if (foundUser) return { code: 200, message: `username is being used` };
    else return { code: 404, message: `username not being used` };
  }
  async findOneById(id: number): Promise<User> {
    let foundUser = await this.usersRepository.findOne({
      where: { id: id },
      include: [
        UserPreference,
        Color,
        Title,
        SubmissionCount,
        Notification,
        {
          model: Image,
          as: 'profilePicture',
          where: { type: 'pfp', id: { [Op.ne]: null } },
          required: false,
        },
      ],
    });
    if (foundUser) return foundUser;
    else throw new HttpException('User not found', 404);
  }
}
