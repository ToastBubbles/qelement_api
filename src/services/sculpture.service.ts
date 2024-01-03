import { Injectable, Inject } from '@nestjs/common';
import { Sculpture } from '../models/sculpture.entity';
import { where } from 'sequelize';
import { QPart } from 'src/models/qPart.entity';
import { Part } from 'src/models/part.entity';
import { PartMold } from 'src/models/partMold.entity';
import { PartStatus } from 'src/models/partStatus.entity';
import { Image } from 'src/models/image.entity';
import { Color } from 'src/models/color.entity';
import { Comment } from 'src/models/comment.entity';
import { User } from 'src/models/user.entity';
import sequelize from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class SculpturesService {
  constructor(
    @Inject('SCULPTURE_REPOSITORY')
    private sculpturesRepository: typeof Sculpture,
  ) {}

  async findAll(): Promise<Sculpture[]> {
    return this.sculpturesRepository.findAll<Sculpture>();
  }
  async findById(id: number): Promise<Sculpture | null> {
    return this.sculpturesRepository.findOne<Sculpture>({
      where: { id: id },
      include: [
        {
          model: QPart,
          include: [
            { model: PartMold, include: [Part] },
            PartStatus,
            Image,
            Color,
          ],
        },
        User,
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
    });
  }

  async findRecent(limit: number): Promise<Sculpture[]> {
    return this.sculpturesRepository.findAll<Sculpture>({
      include: [
        {
          model: QPart,
          include: [
            { model: PartMold, include: [Part] },
            PartStatus,
            Image,
            Color,
          ],
        },
        User,
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
      limit,
      order: [['createdAt', 'DESC']],
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }

  async findAllNotApproved(): Promise<Sculpture[]> {
    return this.sculpturesRepository.findAll<Sculpture>({
      include: [
        {
          model: QPart,
          include: [
            { model: PartMold, include: [Part] },
            PartStatus,
            Image,
            Color,
          ],
        },
        User,
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
      where: {
        approvalDate: null,
      },
    });
  }

  async findByIdAll(id: number): Promise<Sculpture | null> {
    const result = await this.sculpturesRepository.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: QPart,
          include: [
            { model: PartMold, include: [Part] },
            PartStatus,
            Image,
            Color,
          ],
        },
        User,
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
    });

    return result;
  }
}
