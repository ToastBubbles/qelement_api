
    import { Module } from '@nestjs/common';
    import { ElementIDsController } from '../controllers/elementID.controller';
    import { ElementIDsService } from '../services/elementID.service';
    import { elementIDsProviders } from '../providers/elementID.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [ElementIDsController],
    providers: [ElementIDsService, ...elementIDsProviders],
    })
    export class ElementIDModule {}
    