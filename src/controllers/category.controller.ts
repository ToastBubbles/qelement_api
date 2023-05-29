import { Body, Controller, Get, Post } from '@nestjs/common';
import { IAPIResponse, iNameOnly } from 'src/interfaces/general';
import { Category } from 'src/models/category.entity';
import { CategoriesService } from '../services/category.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  // @Get('/add')
  // async addTestCat(): Promise<Category> {
  //   let testCat = new Category({
  //     name: 'Brick',
  //   });
  //   testCat.save();
  //   return testCat;
  // }

  @Post()
  async addNewCategory(
    @Body()
    data: iNameOnly,
  ): Promise<IAPIResponse> {
    let didSave = false;
    try {
      let newCat = new Category({
        name: data.name,
      });
      //example of catching duplicates
      await newCat
        .save()
        .then(() => (didSave = true))
        .catch((err) => {});
      if (didSave) return { code: 200, message: `new category added` };
      else return { code: 500, message: `category aready exists` };
    } catch (error) {
      console.log(error);

      return { code: 500, message: `generic error` };
    }
  }
}
