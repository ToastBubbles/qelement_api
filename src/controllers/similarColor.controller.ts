import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  IAPIResponse,
  ISimColorIdWithInversionId,
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
  @Get('/id/:id')
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
    data: ISimColorIdWithInversionId,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.similarColorsService.findByIdAll(data.id);
      let thisInvObj = await this.similarColorsService.findByIdAll(
        data.inversionId,
      );
      if (thisObj && thisInvObj) {
        await thisObj.update({
          approvalDate: new Date().toISOString().slice(0, 23).replace('T', ' '),
        });
        await thisInvObj.update({
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
  async denySimColor(
    @Body() data: ISimColorIdWithInversionId,
  ): Promise<IAPIResponse> {
    try {
      // Find the color by ID
      const thisObj = await this.similarColorsService.findByIdAll(data.id);
      const thisInvObj = await this.similarColorsService.findByIdAll(
        data.inversionId,
      );
      if (thisObj && thisInvObj) {
        // Delete the color if found
        await thisObj.destroy();
        await thisInvObj.destroy();
        return { code: 200, message: `deleted` };
      } else {
        // Return 404 if color not found
        return { code: 404, message: `not found` };
      }
    } catch (error) {
      // Return the error message for debugging
      console.error(error);
      return { code: 500, message: error.message || `generic error` };
    }
  }

  @Post('/add')
  async addSimilar(
    @Body() { color_one, color_two, creatorId }: ISimilarColorDTO,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(creatorId);
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      if (color_one == color_two) return { message: 'same id', code: 503 };
      let col1 = await this.colorsService.findById(color_one);
      let col2 = await this.colorsService.findById(color_two);

      if (!col1 || !col2) return { message: "color doesn't exist", code: 502 };

      let newMatch = new SimilarColor({
        colorId1: color_one,
        colorId2: color_two,
        creatorId,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });
      let invertMatch = new SimilarColor({
        colorId1: color_two,
        colorId2: color_one,
        creatorId,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });
      let doesExist = await this.similarColorsService.checkIfExists(
        newMatch,
        true,
      );
      let invertedDoesExist = await this.similarColorsService.checkIfExists(
        invertMatch,
        true,
      );

      if (doesExist && invertedDoesExist) {
        if (
          doesExist.deletedAt != null &&
          invertedDoesExist.deletedAt != null
        ) {
          doesExist.restore();
          if (doesExist.approvalDate != null) {
            doesExist.update({
              approvalDate: isAdmin
                ? new Date().toISOString().slice(0, 23).replace('T', ' ')
                : null,
            });
            doesExist.save();
          }
          invertedDoesExist.restore();
          if (invertedDoesExist.approvalDate != null) {
            invertedDoesExist.update({
              approvalDate: isAdmin
                ? new Date().toISOString().slice(0, 23).replace('T', ' ')
                : null,
            });
            invertMatch.save();
          }

          doesExist.save();
          invertedDoesExist.save();
          return { message: 'entries restored', code: 205 };
        }
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
      console.log(error);

      return { message: `failed`, code: 500 };
    }
  }
}
