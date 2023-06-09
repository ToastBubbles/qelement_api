import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IAPIResponse, IQPartDTO, iQPartDTO } from 'src/interfaces/general';
import { QPart } from 'src/models/qPart.entity';
import { RaretyRatingsService } from 'src/services/raretyRating.service';
import { QPartsService } from '../services/qPart.service';
import { log } from 'console';

@Controller('qpart')
export class QPartsController {
  constructor(
    private readonly qPartsService: QPartsService,
    private readonly ratingService: RaretyRatingsService,
  ) {}

  @Get()
  async getAllQParts(): Promise<QPart[]> {
    return this.qPartsService.findAll();
  }

  @Get('/:id')
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
  @Post()
  async addNewPart(
    @Body()
    data: iQPartDTO,
  ): Promise<IAPIResponse> {
    let didSave = false;

    try {
      let newQPart = new QPart({
        partId: data.partId,
        colorId: data.colorId,
        elementId: data.elementId,
        secondaryElementId: data.secondaryElementId,
        creatorId: data.creatorId == -1 ? 1 : data.creatorId,
        note: data.note,
      });

      await newQPart
        .save()
        .then(() => (didSave = true))
        .catch((err) => {
          console.log(err);
        });
      if (didSave) return { code: 200, message: `new part added` };
      else return { code: 500, message: `part aready exists` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
