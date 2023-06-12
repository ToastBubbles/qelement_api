import { Injectable, Inject } from '@nestjs/common';
import { Part } from '../models/part.entity';
import { Op } from 'sequelize';

@Injectable()
export class PartsService {
  constructor(
    @Inject('PART_REPOSITORY')
    private partsRepository: typeof Part,
  ) {}
  async findPartByNum(num: string): Promise<Part | null> {
    const result = await this.partsRepository.findOne({
      where: {
        number: {
          [Op.iLike]: num,
        },
      },
    });
    if (result) return result;

    return null;
  }
  async findById(id: number): Promise<Part | null> {
    const result = await this.partsRepository.findOne({
      where: { id: id },
    });

    return result;
  }
  async findAll(): Promise<Part[]> {
    return this.partsRepository.findAll<Part>();
  }
  async findPartsByCatId(catId: number): Promise<Part[] | null> {
    const result = await this.partsRepository.findAll({
      where: { CatId: catId },
    });

    return result;
  }
}
