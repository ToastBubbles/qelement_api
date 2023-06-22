import { Module } from '@nestjs/common';
import { PartStatusesController } from '../controllers/partStatus.controller';
import { PartStatusesService } from '../services/partStatus.service';
import { partStatusesProviders } from '../providers/partStatus.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PartStatusesController],
  providers: [PartStatusesService, ...partStatusesProviders],
  exports: [PartStatusesService],
})
export class PartStatusModule {}
