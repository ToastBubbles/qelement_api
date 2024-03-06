import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
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
import { User } from 'src/models/user.entity';
import { SubmissionCount } from 'src/models/submissionCount.entity';

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
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.similarColorsService.findByIdAll(data.id);

      if (thisObj) {
        await thisObj.update({
          approvalDate: new Date().toISOString().slice(0, 23).replace('T', ' '),
        });
        await SimilarColor.approveSimilarColorInversion(thisObj);
        return { code: 200, message: `approved` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/deny')
  async denySimColor(@Body() data: iIdOnly): Promise<IAPIResponse> {
    try {
      // Find the color by ID
      const thisObj = await this.similarColorsService.findByIdAll(data.id);
      // const thisInvObj = await this.similarColorsService.findByIdAll(
      //   data.inversionId,
      // );
      if (thisObj) {

        if (thisObj.approvalDate == null) {
          await SubmissionCount.decreasePending(thisObj.creatorId);
        } else {
          await SubmissionCount.decreaseApproved(thisObj.creatorId);
        }
        // Delete the color if found
        await thisObj.destroy();

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
    @Body() { color_one, color_two }: ISimilarColorDTO,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      if (color_one == color_two) return { message: 'same id', code: 503 };
      let col1 = await this.colorsService.findById(color_one);
      let col2 = await this.colorsService.findById(color_two);

      if (!col1 || !col2) return { message: "color doesn't exist", code: 502 };

      let similarColor = await SimilarColor.findOne({
        paranoid: false, // Include soft-deleted entries
        where: {
          colorId1: color_one,
          colorId2: color_two,
        },
      });

      // If the inverse similar color does not exist (including soft-deleted entries), create it
      if (!similarColor) {
        similarColor = await SimilarColor.create({
          colorId1: color_one,
          colorId2: color_two,
          creatorId: userId, // You may want to adjust this based on your requirements
          approvalDate: isAdmin
            ? new Date().toISOString().slice(0, 23).replace('T', ' ')
            : null,
          // You may need to set other properties like approvalDate based on your requirements
        });
        if (!isAdmin) return { code: 202, message: 'Similar Color requested' };
        return { code: 200, message: 'Similar Color created' };
      } else if (similarColor.deletedAt !== null) {
        // If the inverse similar color exists but is soft-deleted, restore it
        await similarColor.update({
          approvalDate: isAdmin
            ? new Date().toISOString().slice(0, 23).replace('T', ' ')
            : null,
        });
        await similarColor.restore();

        if (!isAdmin) return { code: 202, message: 'Similar Color requested' };
        return { code: 201, message: 'Similar Color restored' };
      }
      return { code: 501, message: 'Similar Color failed to create' };
    } catch (error) {
      console.log(error);

      return { message: `failed`, code: 500 };
    }
  }
}
