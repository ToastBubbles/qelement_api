import { Injectable, Inject } from '@nestjs/common';
import { Subcategory } from '../models/subcategory.entity';

@Injectable()
export class SubcategoryService {
  constructor(
    @Inject('SUBCATEGORY_REPOSITORY')
    private subcategoryRepository: typeof Subcategory,
  ) {}

  async findAll(): Promise<Subcategory[]> {
    return this.subcategoryRepository.findAll<Subcategory>();
  }
}
