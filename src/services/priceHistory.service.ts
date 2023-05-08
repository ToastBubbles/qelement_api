
    import { Injectable, Inject } from '@nestjs/common';
    import { PriceHistory } from '../models/priceHistory.entity';

    @Injectable()
    export class PriceHistoriesService {
    constructor(
        @Inject('PRICEHISTORY_REPOSITORY')
        private priceHistoriesRepository: typeof PriceHistory,
    ) {}
    
    async findAll(): Promise<PriceHistory[]> {
        return this.priceHistoriesRepository.findAll<PriceHistory>();
    }
    }
    