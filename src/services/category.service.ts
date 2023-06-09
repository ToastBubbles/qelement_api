import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Category } from '../models/category.entity';
import { IQelementError } from 'src/interfaces/error';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoriesRepository: typeof Category,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll<Category>();
  }

  async findById(id: number): Promise<Category> {
    const result = await this.categoriesRepository.findOne({
      where: { id: id },
    });
    if (result) {
      return result;
    }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    throw new HttpException('Cat not found', 404);
  }
}
