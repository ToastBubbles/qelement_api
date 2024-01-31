import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { IAPIResponse, IRatingDTO } from 'src/interfaces/general';
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
  ): Promise<number | undefined> {
    const userId = req.user.id;
    console.log(userId);
    let rating = await this.raretyRatingsService.findByUserAndQPartId(
      userId,
      qpartId,
    );
    return rating?.rating;
  }

  @Post('/addRating')
  async addUserRatingOfQPart(
    @Body()
    ratingDTO: IRatingDTO,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    const userId = req.user.id;
    console.log('##############################');

    console.log(req);
    console.log('##############################');
    console.log(req.user);
    console.log('##############################');
    if (userId) {
      ratingDTO.creatorId = userId;
      await this.raretyRatingsService.addRating(ratingDTO);
      return { code: 200, message: 'Added' };
    } else {
      return { code: 509, message: 'Authentication Error' };
    }
  }
}
