import { Module } from '@nestjs/common';
import { PartsController } from '../controllers/parts.controller';
import { PartsService } from '../services/parts.service';
import { partsProviders } from '../providers/parts.providers';
import { DatabaseModule } from './database.module';
import { PartMoldModule } from './partMold.module';

@Module({
  imports: [DatabaseModule, PartMoldModule],
  controllers: [PartsController],
  providers: [PartsService, ...partsProviders],
  exports: [PartsService],
})
export class PartsModule {}
