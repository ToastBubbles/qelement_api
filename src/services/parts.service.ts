import { Injectable, Inject } from '@nestjs/common';
import { Part } from '../models/part.entity';
import { Op } from 'sequelize';
import { PartMold } from 'src/models/partMold.entity';
import { QPart } from 'src/models/qPart.entity';
import { Color } from 'src/models/color.entity';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { User } from 'src/models/user.entity';

@Injectable()
export class PartsService {
  constructor(
    @Inject('PART_REPOSITORY')
    private partsRepository: typeof Part,
  ) {}
  async findAll(): Promise<Part[]> {
    return this.partsRepository.findAll<Part>({
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }
  async findAllNotApproved(): Promise<Part[]> {
    return this.partsRepository.findAll<Part>({
      where: {
        approvalDate: null,
      },
    });
  }
  async findPartByNum(num: string): Promise<Part | null> {
    const result = await this.partsRepository.findOne({
      where: {
        number: {
          [Op.iLike]: num,
        },
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    if (result) return result;

    return null;
  }
  async findById(id: number): Promise<Part | null> {
    const result = await this.partsRepository.findOne({
      where: {
        id: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });

    return result;
  }

  async findChildrenById(id: number): Promise<Part | null> {
    const result = await this.partsRepository.findOne({
      where: {
        id: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });

    return result;
  }

  async findPartsByCatId(catId: number): Promise<Part[] | null> {
    const result = await this.partsRepository.findAll({
      include: [PartMold],
      where: {
        CatId: catId,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });

    return result;
  }

  async findByIdAll(id: number): Promise<Part | null> {
    const result = await this.partsRepository.findOne({
      where: {
        id: id,
      },
    });

    return result;
  }

  async findByIDWithQParts(partId: number): Promise<Part | null> {
    const results = await this.partsRepository.findOne({
      include: [
        {
          model: PartMold,
          include: [Color, { model: User, as: 'creator' }, RaretyRating],
        },
      ],
      where: {
        // moldId: moldId,
        id: partId,
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
