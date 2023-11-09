import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import {
  IAPIResponse,
  IPartWithMoldDTO,
  ISearchOnly,
  iIdOnly,
} from 'src/interfaces/general';
import { Part } from 'src/models/part.entity';
import { PartsService } from '../services/parts.service';
import { trimAndReturn } from 'src/utils/utils';
import { PartMoldsService } from 'src/services/partMold.service';
import { PartMold } from 'src/models/partMold.entity';
import { UsersService } from 'src/services/user.service';

@Controller('parts')
export class PartsController {
  constructor(
    private readonly partsService: PartsService,
    private readonly userService: UsersService,
  ) // private readonly partsMoldService: PartMoldsService,
  {}

  @Get()
  async getAllParts(): Promise<Part[]> {
    return this.partsService.findAll();
  }

  @Get('/byCatId/:id')
  async getPartsByCatId(@Param('id') id: number): Promise<Part[] | null> {
    return this.partsService.findPartsByCatId(id);
  }

  @Get('/search')
  async getSearchResults(@Query() data: ISearchOnly): Promise<Part[] | null> {
    return this.partsService.findPartsBySearch(data.search);
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

  // @Get('/qparts/:id')
  // async findByIDWithQParts(@Param('id') id: number): Promise<Part | null> {
  //   return this.partsService.findByIDWithQParts(id);
  // }

  @Get('/childrenById/:id')
  async findChildrenById(@Param('id') id: number): Promise<Part | null> {
    return this.partsService.findChildrenById(id);
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
      let thisObj = await this.partsService.findByIdAll(data.id);
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
  //findByIDWithQParts

  @Post()
  async addNewPart(
    @Body()
    data: IPartWithMoldDTO,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(data.creatorId);
      let isAdmin = false;
      if (user && user?.role == 'admin' || user.role == 'trusted') {
        isAdmin = true;
      }
      let id: number;
      if (data.id == -1) {
        let newPart = Part.create({
          name: trimAndReturn(data.name, 100),
          CatId: data.CatId,
          note: trimAndReturn(data.partNote),
          blURL: trimAndReturn(data.blURL, 20),
          approvalDate: isAdmin
            ? new Date().toISOString().slice(0, 23).replace('T', ' ')
            : null,
        }).catch((e) => {
          return { code: 500, message: `generic error` };
        });
        id = ((await newPart) as Part).dataValues.id;
      } else {
        id = data.id;
      }
      let newMold = PartMold.create({
        number: data.number,
        note: data.moldNote,
        parentPartId: id,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      }).catch((e) => {
        return { code: 500, message: `generic error` };
      });

      if (newMold instanceof PartMold)
        return { code: 200, message: `new part added` };
      else return { code: 500, message: `part not added` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
