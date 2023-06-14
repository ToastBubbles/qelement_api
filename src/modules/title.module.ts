
    import { Module } from '@nestjs/common';
    import { TitlesController } from '../controllers/title.controller';
    import { TitlesService } from '../services/title.service';
    import { titlesProviders } from '../providers/title.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [TitlesController],
    providers: [TitlesService, ...titlesProviders],
    })
    export class TitleModule {}
    