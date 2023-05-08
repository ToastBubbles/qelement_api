
    import { Module } from '@nestjs/common';
    import { RaretyRatingsController } from '../controllers/raretyRating.controller';
    import { RaretyRatingsService } from '../services/raretyRating.service';
    import { raretyRatingsProviders } from '../providers/raretyRating.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [RaretyRatingsController],
    providers: [RaretyRatingsService, ...raretyRatingsProviders],
    })
    export class RaretyRatingModule {}
    