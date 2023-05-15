import { Module } from '@nestjs/common';
import { QPartsController } from '../controllers/qPart.controller';
import { QPartsService } from '../services/qPart.service';
import { qPartsProviders } from '../providers/qPart.providers';
import { DatabaseModule } from './database.module';
import { RaretyRatingModule } from './raretyRating.module';

@Module({
  imports: [DatabaseModule, RaretyRatingModule],
  controllers: [QPartsController],
  providers: [QPartsService, ...qPartsProviders],
})
export class QPartModule {}
