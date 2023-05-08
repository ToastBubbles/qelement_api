
    import { Controller, Get } from '@nestjs/common';
    import { RaretyRating } from 'src/models/raretyRating.entity';
    import { RaretyRatingsService } from '../services/raretyRating.service';
    
    @Controller('raretyRating')
    export class RaretyRatingsController {
      constructor(private readonly raretyRatingsService: RaretyRatingsService) {}
    
      @Get()
      async getAllRaretyRatings(): Promise<RaretyRating[]> {
        return this.raretyRatingsService.findAll();
      }
    }
    