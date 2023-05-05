import { Module } from '@nestjs/common';
import { ColorsController } from '../controllers/color.controller';
import { ColorsService } from '../services/color.service';
import { colorsProviders } from '../providers/color.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ColorsController],
  providers: [ColorsService, ...colorsProviders],
})
export class ColorModule {}
