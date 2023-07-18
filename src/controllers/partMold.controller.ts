import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PartMold } from 'src/models/partMold.entity';
import { PartMoldsService } from '../services/partMold.service';
import { IAPIResponse, ISearchOnly, iIdOnly } from 'src/interfaces/general';

@Controller('partMold')
export class PartMoldsController {
  constructor(private readonly partMoldsService: PartMoldsService) {}

  @Get()
  async getAllPartMolds(): Promise<PartMold[]> {
    return this.partMoldsService.findAll();
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<PartMold[]> {
    return this.partMoldsService.findAllNotApproved();
  }

  @Get('/search')
  async getSearchResults(@Query() data: ISearchOnly): Promise<PartMold[] | null> {
    return this.partMoldsService.findPartsBySearch(data.search);
  }

  @Post('/approve')
  async approvePart(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.partMoldsService.findByIdAll(data.id);
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
}
