import { Injectable, Inject } from '@nestjs/common';
import { QPart } from '../models/qPart.entity';
import { log } from 'console';
import { Op } from 'sequelize';
import { Part } from 'src/models/part.entity';
import { PartMold } from 'src/models/partMold.entity';
import { Color } from 'src/models/color.entity';
import { User } from 'src/models/user.entity';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { PartStatus } from 'src/models/partStatus.entity';

@Injectable()
export class QPartsService {
  constructor(
    @Inject('QPART_REPOSITORY')
    private qPartsRepository: typeof QPart,
  ) {}

  async findAll(): Promise<QPart[]> {
    return this.qPartsRepository.findAll<QPart>({
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }

  async findAllNotApproved(): Promise<QPart[]> {
    return this.qPartsRepository.findAll<QPart>({
      include: [
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
      ],
      where: {
        approvalDate: null,
      },
    });
  }
  async findRecent(limit: number): Promise<QPart[]> {
    console.log('recent');

    return this.qPartsRepository.findAll<QPart>({
      include: [
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        PartStatus,
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

  async findById(id: number): Promise<QPart | null> {
    const result = await this.qPartsRepository.findOne({
      include: [
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        PartStatus,
      ],
      where: {
        id: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    // if (result) {
    return result;
    // }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    // throw new HttpException('Color not found', 404);
  }

  async findByIdAll(id: number): Promise<QPart | null> {
    const result = await this.qPartsRepository.findOne({
      where: {
        id: id,
      },
    });

    return result;
  }

  async findMatchesByPartId(partId: number): Promise<QPart[] | null> {
    const results = await this.qPartsRepository.findAll({
      include: [
        {
          model: PartMold,
          include: [
            {
              model: Part,

              required: true,
              duplicating: false,
            },
          ],
          required: true,
          duplicating: false,
        },
        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        PartStatus,
      ],
      where: {
        // moldId: moldId,
        '$mold.parentPart.id$': partId,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    // if (result) {
    return results;
    // }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    // throw new HttpException('Color not found', 404);
  }
}
