import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PartStatus } from 'src/models/partStatus.entity';
import { PartStatusesService } from '../services/partStatus.service';
import {
  IAPIResponse,
  IArrayOfIDs,
  IPartStatusDTO,
  iIdOnly,
} from 'src/interfaces/general';
import { trimAndReturn } from 'src/utils/utils';
import { UsersService } from 'src/services/user.service';
import { SubmissionCount } from 'src/models/submissionCount.entity';

@Controller('partStatus')
export class PartStatusesController {
  constructor(
    private readonly partStatusesService: PartStatusesService,
    private userService: UsersService,
  ) {}

  @Get()
  async getAllPartStatuses(): Promise<PartStatus[]> {
    return this.partStatusesService.findAll();
  }

  @Get('/byQPartId/:qpartId')
  async getByQPartId(@Param('qpartId') qpartId: number): Promise<PartStatus[]> {
    return this.partStatusesService.findByQPartId(qpartId);
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<PartStatus[]> {
    return this.partStatusesService.findAllNotApproved();
  }

  @Post('/approve')
  async approvePartStatus(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.partStatusesService.findByIdAll(data.id);
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

  @Post('/deny')
  async denyPartMold(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.partStatusesService.findByIdAll(data.id);

      if (thisObj) {
        if (thisObj.approvalDate == null) {
          await SubmissionCount.decreasePending(thisObj.creatorId);
        } else {
          await SubmissionCount.decreaseApproved(thisObj.creatorId);
        }
        await thisObj.destroy();
        return { code: 200, message: `deleted` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/add')
  async addNewPartStatus(
    @Body()
    data: IPartStatusDTO,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(data.creatorId);
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      let newPart = await PartStatus.create({
        status: data.status,
        date: data.date,
        location: trimAndReturn(data.location, 100),
        note: trimAndReturn(data.note),
        qpartId: data.qpartId,
        creatorId: data.creatorId,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });

      if (newPart instanceof PartStatus) {
        if (isAdmin) {
          return { code: 200, message: `new part status added` };
        }

        return { code: 201, message: `new part status submitted.` };
      } else return { code: 500, message: `part status aready exists` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/mass')
  async massAddKnownStatus(
    @Body()
    data: IArrayOfIDs,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(data.userId);
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      const createdStatuses: PartStatus[] = [];

      for (const id of data.ids) {
        console.log('******Creating: ', id);
        const newPartStatus = await this.createKnownPartStatus(
          data.userId,
          id,
          isAdmin,
        );

        if (newPartStatus instanceof PartStatus) {
          createdStatuses.push(newPartStatus);
        } else {
          return { code: 509, message: 'error' };
        }
      }

      if (createdStatuses.length > 0) {
        console.log('******Adding: ', createdStatuses.length);
        if (isAdmin) {
          return { code: 201, message: 'added, and approved' };
        }
        return { code: 200, message: 'submitted for approval' };
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

  private async createKnownPartStatus(
    userId: number,
    id: number,
    isAdmin: boolean,
  ): Promise<PartStatus | null> {
    try {
      // Check if the part already exists or create a new one

      // Create a new QPart
      const newPartStatus = await PartStatus.create({
        qpartId: id,
        creatorId: userId == -1 ? 1 : userId,
        status: 'known',
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });

      return newPartStatus;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
