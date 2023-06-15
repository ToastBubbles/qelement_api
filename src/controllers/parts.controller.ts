import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { IAPIResponse, IPartDTO, iIdOnly } from 'src/interfaces/general';
import { Category } from 'src/models/category.entity';
import { Part } from 'src/models/part.entity';
import { PartsService } from '../services/parts.service';
import { log } from 'console';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get()
  async getAllParts(): Promise<Part[]> {
    return this.partsService.findAll();
  }

  @Get('/byCatId/:id')
  async getPartsByCatId(@Param('id') id: number): Promise<Part[] | null> {
    return this.partsService.findPartsByCatId(id);
  }

  @Get('/byNumber/:num')
  async getPartByNum(@Param('num') num: string): Promise<Part | undefined> {
    let result = await this.partsService.findPartByNum(num);

    if (result != null) return result;

    return undefined;
  }

  @Get('/id/:id')
  async findById(@Param('id') id: number): Promise<Part | null> {
    return this.partsService.findById(id);
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<Part[]> {
    return this.partsService.findAllNotApproved();
  }

  @Post('/approve')
  async approvePart(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.partsService.findById(data.id);
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
    data: IPartDTO,
  ): Promise<IAPIResponse> {
    let didSave = false;

    try {
      let newPart = new Part({
        name: data.name,
        number: data.number,
        secondaryNumber: data.secondaryNumber,
        CatId: data.CatId,
        note: data.note,
      });
      await newPart
        .save()
        .then(() => (didSave = true))
        .catch((err) => {});
      if (didSave) return { code: 200, message: `new part added` };
      else return { code: 500, message: `part aready exists` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
