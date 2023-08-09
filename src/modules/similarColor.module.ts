import { Module } from '@nestjs/common';
import { SimilarColorsController } from '../controllers/similarColor.controller';
import { SimilarColorsService } from '../services/similarColor.service';
import { similarColorsProviders } from '../providers/similarColor.providers';
import { DatabaseModule } from './database.module';
import { ColorModule } from './color.module';
import { UserModule } from './user.module';

@Module({
  imports: [DatabaseModule, ColorModule, UserModule],
  controllers: [SimilarColorsController],
  providers: [SimilarColorsService, ...similarColorsProviders],
  exports: [SimilarColorsService],
})
export class SimilarColorModule {}
