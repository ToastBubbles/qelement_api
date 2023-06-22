import { Module } from '@nestjs/common';
import { QPartsController } from '../controllers/qPart.controller';
import { QPartsService } from '../services/qPart.service';
import { qPartsProviders } from '../providers/qPart.providers';
import { DatabaseModule } from './database.module';
import { RaretyRatingModule } from './raretyRating.module';
import { ColorModule } from './color.module';
import { PartsModule } from './parts.module';

@Module({
  imports: [DatabaseModule, RaretyRatingModule, ColorModule, PartsModule],
  controllers: [QPartsController],
  providers: [QPartsService, ...qPartsProviders],
  exports: [QPartsService],
})
export class QPartModule {}
