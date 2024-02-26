import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { PartMold } from 'src/models/partMold.entity';
import { PartMoldsService } from '../services/partMold.service';
import {
  IAPIResponse,
  IAPIResponseWithIds,
  IMoldEdits,
  ISearchOnly,
  iIdOnly,
} from 'src/interfaces/general';
import { User } from 'src/models/user.entity';
import { QPart } from 'src/models/qPart.entity';
import { trimAndReturn } from 'src/utils/utils';

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
  async getSearchResults(
    @Query() data: ISearchOnly,
  ): Promise<PartMold[] | null> {
    return this.partMoldsService.findPartsBySearch(data.search);
  }

  @Get('/id/:id')
  async findById(@Param('id') id: number): Promise<PartMold | null> {
    let output = await this.partMoldsService.findById(id);

    return output;
  }

  @Get('/number')
  async getByMoldNumber(@Query() data: ISearchOnly): Promise<PartMold | null> {
    return this.partMoldsService.findPartByMoldNumber(data.search);
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

  @Post('/edit')
  async editMold(
    @Body()
    data: IMoldEdits,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      if (user.role !== 'trusted' && user.role !== 'admin')
        return { code: 403, message: 'User not authorized' };

      if (data.id > 0) {
        let thisPart = await this.partMoldsService.findById(data.id);

        if (!thisPart) return { code: 404, message: 'Mold not Found' };

        if (data.note.trim() !== '') {
          thisPart.note = trimAndReturn(data.note);
        }
        if (data.number !== '') {
          thisPart.number = data.number;
        }
        if (data.parentPartId !== -1) {
          thisPart.parentPartId = data.parentPartId;
        }

        await thisPart.save();

        return { code: 200, message: 'Changes saved!' };
      }

      return { code: 500, message: `Mold not Found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `Generic error` };
    }
  }

  @Post('/deny')
  async denyPartMold(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse | IAPIResponseWithIds> {
    try {
      let thisObj = await this.partMoldsService.findByIdAll(data.id);
      const qParts = await QPart.findByMoldId(data.id);
      if (qParts.length > 0) {
        let ids: number[] = qParts.map((qPart) => qPart.id);
        return {
          code: 400,
          message: `QParts are associated with this PartMold. Delete or modify the associated QParts first.`,
          ids,
        };
      }

      if (thisObj) {
        await thisObj.destroy();
        return { code: 200, message: `deleted` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
