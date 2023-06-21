import { Module } from '@nestjs/common';
import { PartMoldsController } from '../controllers/partMold.controller';
import { PartMoldsService } from '../services/partMold.service';
import { partMoldsProviders } from '../providers/partMold.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PartMoldsController],
  providers: [PartMoldsService, ...partMoldsProviders],
  exports: [PartMoldsService],
})
export class PartMoldModule {}
