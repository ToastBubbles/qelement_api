import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserInventory } from 'src/models/userInventory.entity';
import { UserInventoriesService } from '../services/userInventory.service';
import { IAPIResponse, ICollectionDTO } from 'src/interfaces/general';
import { trimAndReturn } from 'src/utils/utils';

@Controller('userInventory')
export class UserInventoriesController {
  constructor(
    private readonly userInventoriesService: UserInventoriesService,
  ) {}

  @Get()
  async getAllUserInventories(): Promise<UserInventory[]> {
    return this.userInventoriesService.findAll();
  }

  @Post('/add')
  async addCollectionItem(
    @Body()
    collectionDTO: ICollectionDTO,
  ): Promise<IAPIResponse> {
    try {
      let failed = false;
      let newCollectionItem = await UserInventory.create({
        forTrade: collectionDTO.forTrade,
        forSale: collectionDTO.forSale,
        qpartId: collectionDTO.qpartId,
        userId: collectionDTO.userId,
        quantity: collectionDTO.quantity,
        condition: collectionDTO.condition.toLowerCase(),
        note: trimAndReturn(collectionDTO.note),
      }).catch((e) => {
        failed = true;
      });

      if (newCollectionItem instanceof UserInventory) {
        return { code: 200, message: 'success' };
      }
      if (failed) {
        return { code: 501, message: 'failed' };
      }
      return { code: 500, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }
}
