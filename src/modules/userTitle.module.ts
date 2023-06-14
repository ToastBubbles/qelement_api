
    import { Module } from '@nestjs/common';
    import { UsertitlesController } from '../controllers/userTitle.controller';
    import { UsertitlesService } from '../services/userTitle.service';
    import { usertitlesProviders } from '../providers/userTitle.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [UsertitlesController],
    providers: [UsertitlesService, ...usertitlesProviders],
    })
    export class UserTitleModule {}
    