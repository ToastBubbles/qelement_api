
    import { Module } from '@nestjs/common';
    import { PriceHistoriesController } from '../controllers/priceHistory.controller';
    import { PriceHistoriesService } from '../services/priceHistory.service';
    import { priceHistoriesProviders } from '../providers/priceHistory.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [PriceHistoriesController],
    providers: [PriceHistoriesService, ...priceHistoriesProviders],
    })
    export class PriceHistoryModule {}
    