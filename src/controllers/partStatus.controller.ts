import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PartStatus } from 'src/models/partStatus.entity';
import { PartStatusesService } from '../services/partStatus.service';
import { IAPIResponse, IPartStatusDTO, iIdOnly } from 'src/interfaces/general';

@Controller('partStatus')
export class PartStatusesController {
  constructor(private readonly partStatusesService: PartStatusesService) {}

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
      let thisObj = await this.partStatusesService.findById(data.id);
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
      let newPart = PartStatus.create({
        status: data.status,
        date: data.date,
        location: data.location,
        note: data.note,
        qpartId: data.qpartId,
        creatorId: data.creatorId,
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
