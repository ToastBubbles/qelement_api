import { Controller, Get } from '@nestjs/common';
import { Subcategory } from 'src/models/subcategory.entity';
import { SubcategoryService } from '../services/subcategory.service';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoryService) {}

  @Get()
  async getAllSubcategories(): Promise<Subcategory[]> {
    return this.subcategoriesService.findAll();
  }
}
