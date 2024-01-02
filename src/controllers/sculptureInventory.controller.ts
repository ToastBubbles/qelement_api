import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SculptureInventory } from 'src/models/sculptureInventory.entity';
import { SculptureInventoriesService } from '../services/sculptureInventory.service';
import { IAPIResponse, IArrayOfIDs } from 'src/interfaces/general';
import { UsersService } from 'src/services/user.service';
import { SculpturesService } from 'src/services/sculpture.service';

@Controller('sculptureInventory')
export class SculptureInventoriesController {
  constructor(
    private readonly sculptureInventoriesService: SculptureInventoriesService,
    private readonly sculpturesService: SculpturesService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async getAllSculptureInventories(): Promise<SculptureInventory[]> {
    return this.sculptureInventoriesService.findAll();
  }

  @Post('/addParts/:id')
  async addSculptureParts(
    @Param('id') id: number,
    @Body()
    data: IArrayOfIDs,
  ): Promise<IAPIResponse> {
    try {
      let sculpture = await this.sculpturesService.findById(id);
      if (sculpture == null) return { code: 506, message: 'Bad Sculpture ID' };
      let user = await this.userService.findOneById(data.userId);
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      const createdInventoryItems: SculptureInventory[] = [];

      for (let qpartId of data.ids) {
        let thisItem = await SculptureInventory.create({
          qpartId,
          sculptureId: id,
          approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
        });
        if (thisItem instanceof SculptureInventory) {
          createdInventoryItems.push(thisItem);
        }
      }

      if (createdInventoryItems.length > 0) {
        if (isAdmin) {
          return {
            code: 201,
            message: 'added, and approved',
          };
        }
        return {
          code: 200,
          message: 'submitted for approval',
        };
      } else {
        return {
          code: 500,
          message: 'All parts already exist or generic error',
        };
      }
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
