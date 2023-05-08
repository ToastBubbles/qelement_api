
    import { Module } from '@nestjs/common';
    import { UserInventoriesController } from '../controllers/userInventory.controller';
    import { UserInventoriesService } from '../services/userInventory.service';
    import { userInventoriesProviders } from '../providers/userInventory.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [UserInventoriesController],
    providers: [UserInventoriesService, ...userInventoriesProviders],
    })
    export class UserInventoryModule {}
    