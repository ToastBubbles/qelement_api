import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  IAPIResponse,
  ICatDTO,
  iIdOnly,
  iNameOnly,
} from 'src/interfaces/general';
import { Category } from 'src/models/category.entity';
import { CategoriesService } from '../services/category.service';
import { trimAndReturn } from 'src/utils/utils';
import { UsersService } from 'src/services/user.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly userService: UsersService,
  ) {}

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
      let thisObj = await this.categoriesService.findByIdAll(data.id);
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

  @Post('/delete')
  async deleteCategory(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.categoriesService.findByIdAll(data.id);
      if (thisObj) {
        thisObj.destroy();
        return { code: 200, message: `deleted` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post()
  async addNewCategory(
    @Body()
    data: ICatDTO,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(data.creatorId);
      let isAdmin = false;
      if (user && user?.role == 'admin') {
        isAdmin = true;
      }
      let newCat = Category.create({
        name: trimAndReturn(data.name, 50),
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      }).catch((e) => {
        return { code: 500, message: `generic error` };
      });

      if ((await newCat) instanceof Category)
        return { code: 200, message: `new category added` };
      else return { code: 501, message: `category aready exists` };
    } catch (error) {
      console.log(error);

      return { code: 500, message: `generic error` };
    }
  }
}
