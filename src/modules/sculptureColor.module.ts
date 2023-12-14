
    import { Module } from '@nestjs/common';
    import { SculptureColorsController } from '../controllers/sculptureColor.controller';
    import { SculptureColorsService } from '../services/sculptureColor.service';
    import { sculptureColorsProviders } from '../providers/sculptureColor.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [SculptureColorsController],
    providers: [SculptureColorsService, ...sculptureColorsProviders],
    })
    export class SculptureColorModule {}
    