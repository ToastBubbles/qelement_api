import { Module } from '@nestjs/common';
import { SimilarColorsController } from '../controllers/similarColor.controller';
import { SimilarColorsService } from '../services/similarColor.service';
import { similarColorsProviders } from '../providers/similarColor.providers';
import { DatabaseModule } from './database.module';
import { ColorModule } from './color.module';

@Module({
  imports: [DatabaseModule, ColorModule],
  controllers: [SimilarColorsController],
  providers: [SimilarColorsService, ...similarColorsProviders],
})
export class SimilarColorModule {}
