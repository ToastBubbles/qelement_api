import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PartStatus } from 'src/models/partStatus.entity';
import { PartStatusesService } from '../services/partStatus.service';
import { IAPIResponse, IPartStatusDTO, iIdOnly } from 'src/interfaces/general';
import { trimAndReturn } from 'src/utils/utils';
import { UsersService } from 'src/services/user.service';

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

  @Post()
  async addNewPart(
    @Body()
    data: IPartStatusDTO,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(data.creatorId);
      let isAdmin = false;
      if (user && user?.role == 'admin') {
        isAdmin = true;
      }
      let newPart = PartStatus.create({
        status: data.status,
        date: data.date,
        location: trimAndReturn(data.location, 100),
        note: trimAndReturn(data.note),
        qpartId: data.qpartId,
        creatorId: data.creatorId,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      }).catch((e) => {
        return { code: 500, message: `generic error` };
      });

      if (newPart instanceof PartStatus)
        return { code: 200, message: `new part status added` };
      else return { code: 500, message: `part status aready exists` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
