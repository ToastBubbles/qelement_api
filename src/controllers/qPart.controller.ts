import { Controller, Get, Param } from '@nestjs/common';
import { IQPartDTO } from 'src/interfaces/general';
import { QPart } from 'src/models/qPart.entity';
import { RaretyRatingsService } from 'src/services/raretyRating.service';
import { QPartsService } from '../services/qPart.service';

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
      isKnown: thisQPart?.isKnown,
      partId: thisQPart?.partId,
      colorId: thisQPart?.colorId,
      creatorId: thisQPart?.creatorId,
      rarety: await this.ratingService.getRatingTotal(id),
    };
    console.log(qpartDTOOutput);

    return qpartDTOOutput as IQPartDTO;
  }
  @Get('/add/:id')
  async addTestQPart(@Param('id') id: number): Promise<QPart> {
    let testQPart = new QPart({
      isKnown: 'false',
      partId: 1,
      colorId: id,
      creatorId: 1,
    });
    testQPart.save();
    return testQPart;
  }
}