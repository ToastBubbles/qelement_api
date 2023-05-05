import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../models/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoriesRepository: typeof Category,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll<Category>();
  }
}
