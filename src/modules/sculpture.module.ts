import { Module } from '@nestjs/common';
import { SculpturesController } from '../controllers/sculpture.controller';
import { SculpturesService } from '../services/sculpture.service';
import { sculpturesProviders } from '../providers/sculpture.providers';
import { DatabaseModule } from './database.module';
import { UserModule } from './user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [SculpturesController],
  providers: [SculpturesService, ...sculpturesProviders],
})
export class SculptureModule {}
