import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IAPIResponse, iIdOnly, iNameOnly } from 'src/interfaces/general';
import { Category } from 'src/models/category.entity';
import { CategoriesService } from '../services/category.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    let categories = await this.categoriesService.findAll();
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  }

  @Get('/id/:id')
  async getOneCategory(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findById(id);
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<Category[]> {
    return this.categoriesService.findAllNotApproved();
  }

  @Post('/approve')
  async approveCategory(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.categoriesService.findById(data.id);
      if (thisObj) {
        thisObj.update({
          approvalDate: new Date().toISOString().slice(0, 23).replace('T', ' '),
        });
        return { code: 200, message: `approved` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

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
