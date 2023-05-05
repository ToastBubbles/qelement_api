import { Module } from '@nestjs/common';
import { PartsController } from '../controllers/parts.controller';
import { PartsService } from '../services/parts.service';
import { partsProviders } from '../providers/parts.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PartsController],
  providers: [PartsService, ...partsProviders],
})
export class PartsModule {}
