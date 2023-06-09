import { Module } from '@nestjs/common';
import { ImagesController } from '../controllers/image.controller';
import { ImagesService } from '../services/image.service';
import { imagesProviders } from '../providers/image.providers';
import { DatabaseModule } from './database.module';
import { MinioModule } from './minio.module';

@Module({
  imports: [DatabaseModule, MinioModule],
  controllers: [ImagesController],
  providers: [ImagesService, ...imagesProviders],
  exports: [ImagesService],
})
export class ImageModule {}
