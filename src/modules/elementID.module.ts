import { Module } from '@nestjs/common';
import { ElementIDsController } from '../controllers/elementID.controller';
import { ElementIDsService } from '../services/elementID.service';
import { elementIDsProviders } from '../providers/elementID.providers';
import { DatabaseModule } from './database.module';
import { UserModule } from './user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ElementIDsController],
  providers: [ElementIDsService, ...elementIDsProviders],
  exports: [ElementIDsService],
})
export class ElementIDModule {}
