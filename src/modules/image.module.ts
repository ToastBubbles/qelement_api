
    import { Module } from '@nestjs/common';
    import { ImagesController } from '../controllers/image.controller';
    import { ImagesService } from '../services/image.service';
    import { imagesProviders } from '../providers/image.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [ImagesController],
    providers: [ImagesService, ...imagesProviders],
    })
    export class ImageModule {}
    