import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SculptureInventory } from 'src/models/sculptureInventory.entity';
import { SculptureInventoriesService } from '../services/sculptureInventory.service';
import {
  IAPIResponse,
  IArrayOfIDs,
  IArrayOfSculptureInvIds,
} from 'src/interfaces/general';
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

  @Get('/notApproved')
  async getAllNotApproved(): Promise<SculptureInventory[]> {
    return this.sculptureInventoriesService.findAllNotApproved();
  }

  @Post('/addParts/:id')
  async addSculptureParts(
    @Param('id') id: number,
    @Body()
    data: IArrayOfIDs,
  ): Promise<IAPIResponse> {
    try {
      let sculpture = await this.sculpturesService.findById(id, false);
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

  @Post('/approveInventory')
  async approveSculptureInventory(
    @Body() data: IArrayOfSculptureInvIds,
  ): Promise<IAPIResponse> {
    try {
      console.log(data);

      console.log(data.data);
      console.log(data.data.length);

      if (data.data.length > 0) {
        await Promise.all(
          data.data.map(async (sculpture) => {
            try {
              let invItems =
                await this.sculptureInventoriesService.findAllBySculptureId(
                  sculpture.sculptureId,
                );

              let itemsToApprove = invItems.filter((item) =>
                sculpture.qpartIds.includes(item.qpartId),
              );

              await Promise.all(
                itemsToApprove.map(async (item) => {
                  await item.update({
                    approvalDate: new Date()
                      .toISOString()
                      .slice(0, 23)
                      .replace('T', ' '),
                  });
                }),
              );
            } catch (error) {
              console.error(`Error approving sculpture: ${error}`);
            }
          }),
        );

        return { code: 200, message: 'approved' };
      } else {
        return { code: 500, message: 'not found' };
      }
    } catch (error) {
      console.error(`Generic error: ${error}`);
      return { code: 500, message: 'generic error' };
    }
  }

  @Post('/denyInventory')
  async denySculptureInventory(
    @Body() data: IArrayOfSculptureInvIds,
  ): Promise<IAPIResponse> {
    try {
      if (data.data.length > 0) {
        await Promise.all(
          data.data.map(async (sculpture) => {
            try {
              let invItems =
                await this.sculptureInventoriesService.findAllBySculptureId(
                  sculpture.sculptureId,
                );

              let itemsToApprove = invItems.filter((item) =>
                sculpture.qpartIds.includes(item.qpartId),
              );

              await Promise.all(
                itemsToApprove.map(async (item) => {
                  await item.destroy();
                }),
              );
            } catch (error) {
              console.error(`Error denying sculpture: ${error}`);
            }
          }),
        );

        return { code: 200, message: 'denied successfully' };
      } else {
        return { code: 500, message: 'not found' };
      }
    } catch (error) {
      console.error(`Generic error: ${error}`);
      return { code: 500, message: 'generic error' };
    }
  }
}
