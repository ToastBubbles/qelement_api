import { Module } from '@nestjs/common';
import { ColorsController } from '../controllers/color.controller';
import { ColorsService } from '../services/color.service';
import { colorsProviders } from '../providers/color.providers';
import { DatabaseModule } from './database.module';
import { UserModule } from './user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ColorsController],
  providers: [ColorsService, ...colorsProviders],
  exports: [ColorsService],
})
export class ColorModule {}
