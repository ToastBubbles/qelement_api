import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { IAPIResponse, IRatingDTO, iIdOnly } from 'src/interfaces/general';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { RaretyRatingsService } from '../services/raretyRating.service';

@Controller('rating')
export class RaretyRatingsController {
  constructor(private readonly raretyRatingsService: RaretyRatingsService) {}

  @Get()
  async getAllRaretyRatings(): Promise<RaretyRating[]> {
    return this.raretyRatingsService.findAll();
  }

  @Get('/getMyRating/:qpartId')
  async getUserRatingOfQPart(
    // @Param('userId') userId: number,
    @Param('qpartId') qpartId: number,
    @Req() req: any,
  ): Promise<RaretyRating | null> {
    const userId = req.user.id;
    console.log(userId);
    let rating = await this.raretyRatingsService.findByUserAndQPartId(
      userId,
      qpartId,
    );
    return rating;
  }

  @Post('/addRating')
  async addUserRatingOfQPart(
    @Body()
    ratingDTO: IRatingDTO,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    const userId = req.user.id;

    if (userId) {
      ratingDTO.creatorId = userId;
      await this.raretyRatingsService.addRating(ratingDTO);
      return { code: 200, message: 'Added' };
    } else {
      return { code: 509, message: 'Authentication Error' };
    }
  }

  @Post('/delete')
  async deleteRating(
    @Body()
    data: iIdOnly,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    const userId = req.user.id;

    if (userId) {
      let thisRating = await this.raretyRatingsService.findById(data.id);
      if (thisRating) {
        await thisRating.destroy();
        return { code: 200, message: 'Deleted' };
      }
      return { code: 504, message: `Not Found` };
    } else {
      return { code: 509, message: 'Authentication Error' };
    }
  }
}
