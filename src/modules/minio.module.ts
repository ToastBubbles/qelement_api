import { Module } from '@nestjs/common';
import { ImagesController } from '../controllers/image.controller';
import { ImagesService } from '../services/image.service';
import { imagesProviders } from '../providers/image.providers';
import { DatabaseModule } from './database.module';
import { MinioService } from 'src/services/minio.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
