import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  IAPIResponse,
  IQPartVerifcation,
  ISearchOnly,
  iIdOnly,
  iQPartDTO,
} from 'src/interfaces/general';
import { QPart } from 'src/models/qPart.entity';
import { QPartsService } from '../services/qPart.service';
import { trimAndReturn } from 'src/utils/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('qpart')
export class QPartsController {
  constructor(
    private readonly qPartsService: QPartsService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Get()
  async getAllQParts(): Promise<QPart[]> {
    return this.qPartsService.findAll();
  }
  @Get('/search')
  async getSearchResults(@Query() data: ISearchOnly): Promise<QPart[] | null> {
    return this.qPartsService.findPartsBySearch(data.search);
  }
  @Get('/recent/:limit')
  async getRecentQParts(@Param('limit') limit: number = 10): Promise<QPart[]> {
    return this.qPartsService.findRecent(limit);
  }

  @Get('/id/:id')
  async findById(@Param('id') id: number): Promise<QPart | null> {
    return this.qPartsService.findById(id);
  }

  @Get('/colorMatches/:colorId')
  async findMatchesByColorId(
    @Param('colorId') colorId: number,
  ): Promise<QPart[] | null> {
    return this.qPartsService.findMatchesByColorId(colorId);
  }

  @Get('/qpotd')
  async getQPartOfTheDay(): Promise<QPart | null> {
    try {
      let partOfTheDay = await this.cacheManager.get<QPart>('PartOfTheDay');
      if (partOfTheDay) {
        return partOfTheDay;
      }

      partOfTheDay = await this.qPartsService.getRandom();
      if (partOfTheDay) {
        this.cacheManager.set(
          'PartOfTheDay',
          partOfTheDay,
          1000 * 60 * 60 * 24,
        );
        return partOfTheDay as QPart;
      }
      return null;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  @Get('/getDetails/:id')
  async findDetails(@Param('id') qpartId: number): Promise<QPart | null> {
    let match = await this.qPartsService.findById(qpartId);
    if (match) return match;
    return null;
  }

  @Get('/matchesByPartId/:id')
  async findMatches(@Param('id') partId: number): Promise<QPart[] | null> {
    return await this.qPartsService.findMatchesByPartId(partId);
  }

  @Get('/checkIfExists')
  async checkIfExists(@Query() data: IQPartVerifcation): Promise<IAPIResponse> {
    try {
      let qpart = await this.qPartsService.findIfExists(data);
      if (qpart) {
        return { code: 201, message: 'Already Exists!' };
      }
      return { code: 200, message: 'Good to go' };
    } catch (error) {
      return { code: 500, message: 'error' };
    }
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<QPart[]> {
    return this.qPartsService.findAllNotApproved();
  }

  @Post('/approve')
  async approveQPart(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.qPartsService.findByIdAll(data.id);
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
    data: iQPartDTO,
  ): Promise<IAPIResponse> {
    try {
      const newQPart = await QPart.create({
        moldId: data.moldId,
        colorId: data.colorId,
        type: trimAndReturn(data.type),
        creatorId: data.creatorId == -1 ? 1 : data.creatorId,
        note: trimAndReturn(data.note),
      }).catch((e) => {
        return { code: 500, message: `generic error` };
      });
      console.log(newQPart);

      if (newQPart instanceof QPart) return { code: 200, message: newQPart.id };
      else return { code: 500, message: `part aready exists` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
