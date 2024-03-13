import { Module } from '@nestjs/common';
import { MarbledPartsController } from 'src/controllers/marbledPart.controller';
import { MarbledPartsService } from 'src/services/marbledPart.service';
import { marbledPartsProviders } from 'src/providers/marbledPart.providers';
import { DatabaseModule } from 'src/modules/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MarbledPartsController],
  providers: [MarbledPartsService, ...marbledPartsProviders],
})
export class MarbledPartModule {}
