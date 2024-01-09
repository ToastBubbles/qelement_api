import { Injectable, Inject } from '@nestjs/common';
import { Part } from '../models/part.entity';
import { Op, literal } from 'sequelize';
import { PartMold } from 'src/models/partMold.entity';
import { QPart } from 'src/models/qPart.entity';
import { Color } from 'src/models/color.entity';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { User } from 'src/models/user.entity';
import { Category } from 'src/models/category.entity';

@Injectable()
export class PartsService {
  constructor(
    @Inject('PART_REPOSITORY')
    private partsRepository: typeof Part,
  ) {}
  async findAll(): Promise<Part[]> {
    return this.partsRepository.findAll<Part>({
      include: [Category],
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }
  async findAllNotApproved(): Promise<Part[]> {
    return this.partsRepository.findAll<Part>({
      include: [Category],
      where: {
        approvalDate: null,
      },
    });
  }
  async findPartByNum(num: string): Promise<Part | null> {
    const result = await this.partsRepository.findOne({
      include: [Category],
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
      include: [Category],
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
      include: [Category],
      where: {
        id: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });

    return result;
  }

  async findPartsBySearch(search: string): Promise<Part[] | null> {
    const searchTerm = search.replace(/\s/g, '');
    const result = await this.partsRepository.findAll({
      include: [Category],
      // include: [PartMold],
      where: {
        [Op.or]: [
          // { name: { [Op.iLike]: `%${search}%` } },
          literal(`REPLACE("name", ' ', '') ILIKE '%${searchTerm}%'`),

          // { '$PartMold.number$': { [Op.iLike]: `%${search}%` } },
        ],
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });

    return result;
  }

  async findPartsByCatId(catId: number): Promise<Part[] | null> {
    const result = await this.partsRepository.findAll({
      include: [PartMold, Category],
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
      include: [Category],
      where: {
        id: id,
      },
    });

    return result;
  }

  async findByIDWithQParts(partId: number): Promise<Part | null> {
    const results = await this.partsRepository.findOne({
      include: [
        Category,
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
