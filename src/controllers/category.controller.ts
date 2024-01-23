import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  IAPIResponse,
  ICatDTO,
  ICatEditDTO,
  iIdOnly,
  iNameOnly,
} from 'src/interfaces/general';
import { Category } from 'src/models/category.entity';
import { CategoriesService } from '../services/category.service';
import { trimAndReturn } from 'src/utils/utils';
import { UsersService } from 'src/services/user.service';
import { AdminMiddleware } from 'src/auth/admin.middleware';

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
        thisObj.save();
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
        // await thisObj.update({ name: thisObj.name + '[DELETED]' });
        await thisObj.destroy();
        thisObj.save();
        return { code: 200, message: `deleted` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/edit')
  async editCategory(
    @Body()
    data: ICatEditDTO,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.categoriesService.findByIdAll(data.id);
      if (thisObj) {
        // await thisObj.update({ name: thisObj.name + '[DELETED]' });
        await thisObj.update({
          name: data.newName,
        });
        thisObj.save();
        return { code: 200, message: `updated` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/add')
  async addNewCategory(@Body() data: ICatDTO): Promise<IAPIResponse> {
    try {
      const user = await this.userService.findOneById(data.creatorId);
      const isAdmin =
        user && (user.role === 'admin' || user.role === 'trusted');

      let catNameCheck = await this.categoriesService.findSoftDeletedByName(
        data.name,
      );

      if (catNameCheck && catNameCheck.isSoftDeleted()) {
        // Category with the same name exists and is soft-deleted
        await catNameCheck.restore();

        // Update approvalDate if the user is an admin
        if (isAdmin) {
          await catNameCheck.update({
            approvalDate: new Date()
              .toISOString()
              .slice(0, 23)
              .replace('T', ' '),
          });
        }

        return isAdmin
          ? { code: 200, message: `New category added. Previously deleted.` }
          : {
              code: 201,
              message: `New category submitted for approval. Previously deleted.`,
            };
      }

      // The category is not soft-deleted, check if it exists
      const existingCategory = await this.categoriesService.findByName(
        data.name,
      );

      if (existingCategory) {
        if (existingCategory.approvalDate === null) {
          return { code: 505, message: `Category already pending approval!` };
        } else {
          return { code: 506, message: `Category already exists!` };
        }
      }

      // Create a new category
      const newCat = await Category.create({
        name: trimAndReturn(data.name, 50),
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });

      return isAdmin
        ? { code: 200, message: `New category added.` }
        : { code: 201, message: `New category submitted for approval.` };
    } catch (error) {
      console.log(error);
      return { code: 504, message: `Generic error` };
    }
  }
}
