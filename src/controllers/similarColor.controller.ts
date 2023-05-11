import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ISimilarColorDTO } from 'src/interfaces/general';
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

  @Get()
  async getAllSimilarColors(): Promise<SimilarColor[]> {
    return this.similarColorsService.findAll();
  }

  @Get('/:id')
  async findSimilar(@Param('id') id: number): Promise<SimilarColor[]> {
    // console.log(this.similarColorsService.findAllSimilar(id));

    return this.similarColorsService.findAllSimilar(id);
    // return this.colorsService.findById(id);
  }

  @Post()
  async addSimilar(
    @Body() { color_one, color_two }: ISimilarColorDTO,
  ): Promise<string> {
    // let color1obj = (await this.colorsService.findById(color_one)) as Color;
    // let color2obj = (await this.colorsService.findById(color_two)) as Color;
    // console.log(typeof color1obj);
    // console.log(color1obj);
    // color1obj.similar.push(color2obj);
    // color2obj.similar.push(color1obj);
    // color1obj.save();
    // color2obj.save();

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
    // if (
    //   !(await this.similarColorsService.checkIfExists(newMatch)) &&
    //   !(await this.similarColorsService.checkIfExists(invertMatch))
    // ) {
    //   newMatch.save();
    // }

    // newMatch.colorId1 = color_one;
    // newMatch.colorId2 = color_two;

    // newMatch.save();
    // invertMatch.save();
    return `color ${color_one} is similar to color ${color_two}`;
  }
}
