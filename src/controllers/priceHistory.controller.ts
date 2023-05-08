
    import { Controller, Get } from '@nestjs/common';
    import { PriceHistory } from 'src/models/priceHistory.entity';
    import { PriceHistoriesService } from '../services/priceHistory.service';
    
    @Controller('priceHistory')
    export class PriceHistoriesController {
      constructor(private readonly priceHistoriesService: PriceHistoriesService) {}
    
      @Get()
      async getAllPriceHistories(): Promise<PriceHistory[]> {
        return this.priceHistoriesService.findAll();
      }
    }
    