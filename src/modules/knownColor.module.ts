
    import { Module } from '@nestjs/common';
    import { KnownColorsController } from '../controllers/knownColor.controller';
    import { KnownColorsService } from '../services/knownColor.service';
    import { knownColorsProviders } from '../providers/knownColor.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [KnownColorsController],
    providers: [KnownColorsService, ...knownColorsProviders],
    })
    export class KnownColorModule {}
    