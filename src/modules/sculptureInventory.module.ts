
    import { Module } from '@nestjs/common';
    import { SculptureInventoriesController } from '../controllers/sculptureInventory.controller';
    import { SculptureInventoriesService } from '../services/sculptureInventory.service';
    import { sculptureInventoriesProviders } from '../providers/sculptureInventory.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [SculptureInventoriesController],
    providers: [SculptureInventoriesService, ...sculptureInventoriesProviders],
    })
    export class SculptureInventoryModule {}
    