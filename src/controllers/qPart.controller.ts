import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  IAPIResponse,
  IColorDTO,
  IPartDTO,
  IQPartDTO,
  IQPartDTOInclude,
  IQPartDetails,
  iIdOnly,
  iQPartDTO,
} from 'src/interfaces/general';
import { QPart } from 'src/models/qPart.entity';
import { RaretyRatingsService } from 'src/services/raretyRating.service';
import { QPartsService } from '../services/qPart.service';
import { log } from 'console';
import { PartsService } from 'src/services/parts.service';
import { ColorsService } from 'src/services/color.service';
import assert from 'assert';
import { trimAndReturn } from 'src/utils/utils';
import { QPartOfTheDayService } from 'src/services/qPartOfTheDay.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('qpart')
export class QPartsController {
  constructor(
    private readonly qPartsService: QPartsService,
    private readonly ratingService: RaretyRatingsService,
    private readonly partService: PartsService,
    private readonly colorService: ColorsService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Get()
  async getAllQParts(): Promise<QPart[]> {
    return this.qPartsService.findAll();
  }

  @Get('/recent/:limit')
  async getRecentQParts(@Param('limit') limit: number = 10): Promise<QPart[]> {
    return this.qPartsService.findRecent(limit);
  }

  @Get('/id/:id')
  async findById(@Param('id') id: number): Promise<QPart | null> {
    return this.qPartsService.findById(id);
  }

  @Get('/qpotd')
  async getQPartOfTheDay(): Promise<QPart> {
    let partOfTheDay = await this.cacheManager.get<QPart>('PartOfTheDay');
    if (partOfTheDay) {
      return partOfTheDay;
    }

    partOfTheDay = await this.qPartsService.getRandom();
    this.cacheManager.set('PartOfTheDay', partOfTheDay, 1000 * 60 * 60 * 24);
    return partOfTheDay as QPart;
  }

  @Get('/dto/:id')
  async findByIdViaDTO(@Param('id') id: number): Promise<IQPartDTO | null> {
    let thisQPart = await this.qPartsService.findById(id);
    let qpartDTOOutput = {
      id: thisQPart?.id,
      moldId: thisQPart?.moldId,
      type: thisQPart?.type,
      colorId: thisQPart?.colorId,
      creatorId: thisQPart?.creatorId,
      rarety: await this.ratingService.getRatingTotal(id),
    };

    return qpartDTOOutput as IQPartDTO;
  }

  @Get('/getDetails/:id')
  async findDetails(
    @Param('id') qpartId: number,
  ): Promise<IQPartDetails | null> {
    function instanceOfIColorDTO(object: any): object is IColorDTO {
      return 'hex' in object;
    }
    function instanceOfIPartDTO(object: any): object is IPartDTO {
      return 'CatId' in object;
    }
    let match = await this.qPartsService.findById(qpartId);

    if (match) {
      let color = await this.colorService.findById(match.colorId);
      let part = await this.partService.findById(match.moldId);
      if (instanceOfIColorDTO(color) && instanceOfIPartDTO(part)) {
        let conversion: IQPartDetails = {
          part: {
            name: part?.name,
            // secondaryNumber: part?.secondaryNumber,
            CatId: part?.CatId,
            note: part?.note,
          },
          color: {
            bl_name: color?.bl_name,
            tlg_name: color?.tlg_name,
            bo_name: color?.bo_name,
            hex: color?.hex,
            bl_id: color?.bl_id,
            tlg_id: color?.tlg_id,
            bo_id: color?.bo_id,
            type: color?.type,
            note: color?.note,
            isOfficial: color?.isOfficial,
          },
          qpart: {
            moldId: match?.moldId,
            colorId: match?.colorId,
            type: match?.type,
            creatorId: match?.creatorId,
            elementId: match.elementId,
            note: match.note,
          },
        };
        return conversion;
      }
    }

    return null;
  }

  @Get('/matchesByPartId/:id')
  async findMatches(@Param('id') partId: number): Promise<QPart[] | null> {
    return await this.qPartsService.findMatchesByPartId(partId);
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
        elementId: trimAndReturn(data.elementId),
        creatorId: data.creatorId == -1 ? 1 : data.creatorId,
        note: trimAndReturn(data.note),
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
