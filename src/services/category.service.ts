import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Category } from '../models/category.entity';
import { IQelementError } from 'src/interfaces/error';
import { NotNull } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Part } from 'src/models/part.entity';
import { PartMold } from 'src/models/partMold.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoriesRepository: typeof Category,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll<Category>({
      include: [{ model: Part, include: [PartMold] }],
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }
  async findAllNotApproved(): Promise<Category[]> {
    return this.categoriesRepository.findAll<Category>({
      where: {
        approvalDate: null,
      },
    });
  }

  async findById(id: number): Promise<Category> {
    const result = await this.categoriesRepository.findOne({
      where: {
        id: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    if (result) {
      return result;
    }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    throw new HttpException('Cat not found', 404);
  }
  async findByName(name: string): Promise<Category | null> {
    const result = await this.categoriesRepository.findOne({
      where: {
        name: name,
      },
    });

    return result;

    // return { message: 'No color found with the TLG id.' } as IQelementError;
    // throw new HttpException('Cat not found', 404);
  }

  async findByIdAll(id: number): Promise<Category> {
    const result = await this.categoriesRepository.findOne({
      where: {
        id: id,
      },
    });
    if (result) {
      return result;
    }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    throw new HttpException('Cat not found', 404);
  }
}
