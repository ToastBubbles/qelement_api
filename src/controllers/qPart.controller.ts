import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  IAPIResponse,
  IColorDTO,
  IPartDTO,
  IQPartDTO,
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

@Controller('qpart')
export class QPartsController {
  constructor(
    private readonly qPartsService: QPartsService,
    private readonly ratingService: RaretyRatingsService,
    private readonly partService: PartsService,
    private readonly colorService: ColorsService,
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

  @Get('/dto/:id')
  async findByIdViaDTO(@Param('id') id: number): Promise<IQPartDTO | null> {
    let thisQPart = await this.qPartsService.findById(id);
    let qpartDTOOutput = {
      id: thisQPart?.id,
      partId: thisQPart?.partId,
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
      return 'secondaryNumber' in object;
    }
    let match = await this.qPartsService.findById(qpartId);

    if (match) {
      let color = await this.colorService.findById(match.colorId);
      let part = await this.partService.findById(match.partId);
      if (instanceOfIColorDTO(color) && instanceOfIPartDTO(part)) {
        let conversion: IQPartDetails = {
          part: {
            name: part?.name,
            number: part?.number,
            secondaryNumber: part?.secondaryNumber,
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
          },
          qpart: {
            partId: match?.partId,
            colorId: match?.colorId,
            creatorId: match?.creatorId,
            elementId: match.elementId,
            secondaryElementId: match.secondaryElementId,
            note: match.note,
          },
        };
        return conversion;
      }
    }

    return null;
  }

  @Get('/matchesByPartId/:id')
  async findMatches(@Param('id') partId: number): Promise<IQPartDTO[] | null> {
    let matches = await this.qPartsService.findMatchesById(partId);

    let conversion: IQPartDTO[] = [];
    if (matches) {
      const ratings = await Promise.all(
        matches?.map((match) => {
          return this.ratingService.getRatingTotals(match.id);
        }),
      );
      // console.log(ratings);

      matches?.forEach((match) => {
        let rating = ratings.find((x) => x.id == match.id)?.rarety;
        let output: IQPartDTO = {
          id: match?.id,
          partId: match?.partId,
          colorId: match?.colorId,
          creatorId: match?.creatorId,
          rarety: rating == undefined ? -1 : rating,
          elementId: match.elementId,
          secondaryElementId: match.secondaryElementId,
          note: match.note,
        };
        conversion.push(output);
      });
      // console.log(conversion);

      return conversion;
    }

    return null;
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
      let thisObj = await this.qPartsService.findById(data.id);
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
      // let newQPart = new QPart({
      //   partId: data.partId,
      //   colorId: data.colorId,
      //   elementId: data.elementId,
      //   secondaryElementId: data.secondaryElementId,
      //   creatorId: data.creatorId == -1 ? 1 : data.creatorId,
      //   note: data.note,
      // });
      const newQPart = await QPart.create({
        partId: data.partId,
        colorId: data.colorId,
        elementId: data.elementId,
        secondaryElementId: data.secondaryElementId,
        creatorId: data.creatorId == -1 ? 1 : data.creatorId,
        note: data.note,
      });
      console.log(newQPart);

      // await newQPart
      //   .save()
      //   .then(() => (didSave = true))
      //   .catch((err) => {
      //     console.log(err);
      //   });
      if (newQPart instanceof QPart) return { code: 200, message: newQPart.id };
      else return { code: 500, message: `part aready exists` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
