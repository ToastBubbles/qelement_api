
    import { Module } from '@nestjs/common';
    import { StatusesController } from '../controllers/status.controller';
    import { StatusesService } from '../services/status.service';
    import { statusesProviders } from '../providers/status.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [StatusesController],
    providers: [StatusesService, ...statusesProviders],
    })
    export class StatusModule {}
    