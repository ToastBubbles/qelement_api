import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserInventory } from 'src/models/userInventory.entity';
import { UserInventoriesService } from '../services/userInventory.service';
import {
  IAPIResponse,
  ICollectionDTO,
  ICollectionItemEdits,
  iIdOnly,
} from 'src/interfaces/general';
import { trimAndReturn } from 'src/utils/utils';
import { User } from 'src/models/user.entity';

@Controller('userInventory')
export class UserInventoriesController {
  constructor(
    private readonly userInventoriesService: UserInventoriesService,
  ) {}

  @Get()
  async getAllUserInventories(): Promise<UserInventory[]> {
    return this.userInventoriesService.findAll();
  }

  @Get('/id/:userid')
  async getUserInventoryByUserId(
    @Param('userid') userId: number,
  ): Promise<UserInventory[]> {
    return this.userInventoriesService.findAllByUserId(userId);
  }

  @Post('/add')
  async addCollectionItem(
    @Body()
    collectionDTO: ICollectionDTO,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      let newCollectionItem = await UserInventory.create({
        forTrade: collectionDTO.forTrade,
        forSale: collectionDTO.forSale,
        availDuplicates: collectionDTO.availDupes,
        qpartId: collectionDTO.qpartId,
        material:
          collectionDTO.material.trim().length > 0
            ? trimAndReturn(collectionDTO.material.toLowerCase(), 15)
            : null,
        userId: userId,
        quantity: collectionDTO.quantity,
        condition: collectionDTO.condition.toLowerCase(),
        note: trimAndReturn(collectionDTO.note),
      });

      if (newCollectionItem instanceof UserInventory) {
        return { code: 200, message: 'success' };
      }

      return { code: 501, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }

  @Post('/edit')
  async editCollectionItem(
    @Body()
    collectionDTO: ICollectionItemEdits,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      let thisCollectionItem = await this.userInventoriesService.findOneById(
        collectionDTO.id,
      );

      if (thisCollectionItem) {
        let hasChanged = false;
        if (collectionDTO.forTrade != thisCollectionItem.forTrade) {
          thisCollectionItem.forTrade = collectionDTO.forTrade;
          hasChanged = true;
        }
        if (collectionDTO.forSale != thisCollectionItem.forSale) {
          thisCollectionItem.forSale = collectionDTO.forSale;
          hasChanged = true;
        }
        if (
          collectionDTO.availDuplicates != thisCollectionItem.availDuplicates
        ) {
          thisCollectionItem.availDuplicates = collectionDTO.availDuplicates;
          hasChanged = true;
        }
        let newMaterial = trimAndReturn(collectionDTO.material, 15);
        if (
          newMaterial != thisCollectionItem.material ||
          !(newMaterial == '' && thisCollectionItem.material == null)
        ) {
          if (newMaterial == '') thisCollectionItem.material = null;
          else thisCollectionItem.material = newMaterial;
          hasChanged = true;
        }
        if (collectionDTO.quantity != thisCollectionItem.quantity) {
          thisCollectionItem.quantity = collectionDTO.quantity;
          hasChanged = true;
        }
        let newCondition = trimAndReturn(collectionDTO.condition.toLowerCase());
        if (newCondition != thisCollectionItem.condition) {
          if (
            newCondition == 'used' ||
            newCondition == 'damaged' ||
            newCondition == 'new'
          ) {
            thisCollectionItem.condition = newCondition;
            hasChanged = true;
          }
        }

        if (hasChanged) {
          await thisCollectionItem.save();
          return { code: 200, message: 'success' };
        } else {
          return { code: 505, message: 'No valid changes' };
        }
      }

      return { code: 501, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }

  @Post('/deleteOne')
  async deleteCollectionItem(
    @Body()
    data: iIdOnly,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      let itemToDelete = await this.userInventoriesService.findOneById(data.id);

      if (itemToDelete && userId == itemToDelete.userId) {
        await itemToDelete.destroy();
        return { code: 200, message: 'success' };
      }

      return { code: 501, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }
}
