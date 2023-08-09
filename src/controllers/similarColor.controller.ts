import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  IAPIResponse,
  ISimilarColorDTO,
  Public,
  iIdOnly,
} from 'src/interfaces/general';
import { Color } from 'src/models/color.entity';
import { SimilarColor } from 'src/models/similarColor.entity';
import { ColorsService } from 'src/services/color.service';
import { SimilarColorsService } from '../services/similarColor.service';
import { UsersService } from 'src/services/user.service';

@Controller('similarColor')
export class SimilarColorsController {
  constructor(
    private readonly similarColorsService: SimilarColorsService,
    private readonly userService: UsersService,
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

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<SimilarColor[]> {
    return this.similarColorsService.findAllNotApproved();
  }

  @Post('/approve')
  async approveSimilarColor(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.similarColorsService.findByIdAll(data.id);
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
  async addSimilar(
    @Body() { color_one, color_two, creatorId }: ISimilarColorDTO,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(creatorId);
      let isAdmin = false;
      if (user && user?.role == 'admin') {
        isAdmin = true;
      }
      if (color_one == color_two) return { message: 'same id', code: 503 };
      let col2 = await this.colorsService.findById(color_two);
      console.log(col2);
      if (!col2) return { message: "color doesn't exist", code: 502 };

      let newMatch = new SimilarColor({
        colorId1: color_one,
        colorId2: color_two,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });
      let invertMatch = new SimilarColor({
        colorId1: color_two,
        colorId2: color_one,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });
      let doesExist = await this.similarColorsService.checkIfExists(newMatch);
      let invertedDoesExist = await this.similarColorsService.checkIfExists(
        invertMatch,
      );

      if (doesExist || invertedDoesExist) {
        return { message: 'already exists', code: 501 };
      } else {
        newMatch.save();
        invertMatch.save();
        return {
          message: `color ${color_one} is similar to color ${color_two}`,
          code: 200,
        };
      }
    } catch (error) {
      return { message: `failed`, code: 500 };
    }
  }
}
