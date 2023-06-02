import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ISimilarColorDTO, Public } from 'src/interfaces/general';
import { Color } from 'src/models/color.entity';
import { SimilarColor } from 'src/models/similarColor.entity';
import { ColorsService } from 'src/services/color.service';
import { SimilarColorsService } from '../services/similarColor.service';

@Controller('similarColor')
export class SimilarColorsController {
  constructor(
    private readonly similarColorsService: SimilarColorsService,
    private readonly colorsService: ColorsService, // private readonly colorsService: ColorsService, //
  ) {}

  @Public()
  @Get()
  async getAllSimilarColors(): Promise<SimilarColor[]> {
    return this.similarColorsService.findAll();
  }
  @Public()
  @Get('/:id')
  async findSimilar(@Param('id') id: number): Promise<SimilarColor[]> {

    return this.similarColorsService.findAllSimilar(id);

  }

  @Post()
  async addSimilar(
    @Body() { color_one, color_two }: ISimilarColorDTO,
  ): Promise<string> {

    let newMatch = new SimilarColor({
      colorId1: color_one,
      colorId2: color_two,
    });
    let invertMatch = new SimilarColor({
      colorId1: color_two,
      colorId2: color_one,
    });
    !(await this.similarColorsService.checkIfExists(newMatch)) &&
      newMatch.save();
    !(await this.similarColorsService.checkIfExists(invertMatch)) &&
      invertMatch.save();

    return `color ${color_one} is similar to color ${color_two}`;
  }
}
