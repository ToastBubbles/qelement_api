import { Injectable, Inject } from '@nestjs/common';
import { Part } from '../models/part.entity';
import { Op } from 'sequelize';

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

  async findPartsByCatId(catId: number): Promise<Part[] | null> {
    const result = await this.partsRepository.findAll({
      where: {
        CatId: catId,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });

    return result;
  }
}
