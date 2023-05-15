import { Controller, Get } from '@nestjs/common';
import { Category } from 'src/models/category.entity';
import { CategoriesService } from '../services/category.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get('/add')
  async addTestCat(): Promise<Category> {
    let testCat = new Category({
      name: 'Brick',
    });
    testCat.save();
    return testCat;
  }
}
