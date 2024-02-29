import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Sculpture } from 'src/models/sculpture.entity';
import { SculpturesService } from '../services/sculpture.service';
import {
  IAPIResponse,
  IArrayOfSculptureInvIds,
  ICreateScupltureDTO,
  ISearchOnly,
  iIdOnly,
} from 'src/interfaces/general';
import { UsersService } from 'src/services/user.service';
import { trimAndReturn } from 'src/utils/utils';

@Controller('sculpture')
export class SculpturesController {
  constructor(
    private readonly sculpturesService: SculpturesService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async getAllSculptures(): Promise<Sculpture[]> {
    return this.sculpturesService.findAll();
  }

  @Get('/byId/:id')
  async getSculptureById(@Param('id') id: number): Promise<Sculpture | null> {
    return this.sculpturesService.findById(id, false);
  }

  @Get('/byIdWithPendingParts/:id')
  async getSculptureByIdAllParts(
    @Param('id') id: number,
  ): Promise<Sculpture | null> {
    return this.sculpturesService.findById(id, true);
  }

  @Get('/recent/:limit')
  async getRecentSculptures(
    @Param('limit') limit: number = 10,
  ): Promise<Sculpture[]> {
    return this.sculpturesService.findRecent(limit);
  }

  @Get('/search')
  async getSearchResults(
    @Query() data: ISearchOnly,
  ): Promise<Sculpture[] | null> {
    return this.sculpturesService.findSculpsBySearch(data.search);
  }

  @Get('/notApproved')
  async getAllNotApproved(): Promise<Sculpture[]> {
    return this.sculpturesService.findAllNotApproved();
  }

  @Get('/notApprovedInventory')
  async getAllNotApprovedInventory(): Promise<Sculpture[]> {
    return this.sculpturesService.findAllWithNotApprovedInventory();
  }

  @Post('/approve')
  async approveSculpture(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.sculpturesService.findByIdAll(data.id);
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
  async denySculpture(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.sculpturesService.findByIdAll(data.id);

      if (thisObj) {
        await thisObj.destroy();
        return { code: 200, message: `deleted` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/add')
  async addNewSculpture(
    @Body()
    data: ICreateScupltureDTO,
  ): Promise<IAPIResponse> {
    try {
      function validateYear(year: number | null): number | null {
        let min = 1932;
        let max = 2500;
        if (year == null || year < min || year > max) return null;
        return year;
      }
      let user = await this.userService.findOneById(data.creatorId);
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      const newSculpture = await Sculpture.create({
        name: trimAndReturn(data.name, 255),
        brickSystem: data.brickSystem,
        location: data.location,
        yearMade: validateYear(data.yearMade),
        yearRetired: validateYear(data.yearRetired),
        keywords: trimAndReturn(data.keywords, 255),
        note: trimAndReturn(data.note, 255),
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
        creatorId: data.creatorId == -1 ? 1 : data.creatorId,
      }).catch((e) => {
        return { code: 500, message: e };
      });
      console.log(newSculpture);

      if (newSculpture instanceof Sculpture) {
        if (isAdmin) return { code: 201, message: newSculpture.id };
        return { code: 200, message: newSculpture.id };
      } else return { code: 500, message: `sculpture aready exists` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
