import { Module } from '@nestjs/common';
import { PartsController } from '../controllers/parts.controller';
import { PartsService } from '../services/parts.service';
import { partsProviders } from '../providers/parts.providers';
import { DatabaseModule } from './database.module';
import { PartMoldModule } from './partMold.module';
import { UserModule } from './user.module';

@Module({
  imports: [DatabaseModule, PartMoldModule, UserModule],
  controllers: [PartsController],
  providers: [PartsService, ...partsProviders],
  exports: [PartsService],
})
export class PartsModule {}
