
    import { Module } from '@nestjs/common';
    import { QPartsController } from '../controllers/qPart.controller';
    import { QPartsService } from '../services/qPart.service';
    import { qPartsProviders } from '../providers/qPart.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [QPartsController],
    providers: [QPartsService, ...qPartsProviders],
    })
    export class QPartModule {}
    