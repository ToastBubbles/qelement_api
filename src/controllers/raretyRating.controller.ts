import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IRatingDTO } from 'src/interfaces/general';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { RaretyRatingsService } from '../services/raretyRating.service';

@Controller('rating')
export class RaretyRatingsController {
  constructor(private readonly raretyRatingsService: RaretyRatingsService) {}

  @Get()
  async getAllRaretyRatings(): Promise<RaretyRating[]> {
    return this.raretyRatingsService.findAll();
  }
  @Get('/:userId/:qpartId')
  async getUserRatingOfQPart(
    @Param('userId') userId: number,
    @Param('qpartId') qpartId: number,
  ): Promise<number | undefined> {
    let rating = await this.raretyRatingsService.findByUserAndQPartId(
      userId,
      qpartId,
    );
    return rating?.rating;
  }

  @Post()
  async addUserRatingOfQPart(
    @Body()
    ratingDTO: IRatingDTO,
  ) {
    this.raretyRatingsService.addRating(ratingDTO);
  }
}
