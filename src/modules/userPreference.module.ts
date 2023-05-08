
    import { Module } from '@nestjs/common';
    import { UserPreferencesController } from '../controllers/userPreference.controller';
    import { UserPreferencesService } from '../services/userPreference.service';
    import { userPreferencesProviders } from '../providers/userPreference.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [UserPreferencesController],
    providers: [UserPreferencesService, ...userPreferencesProviders],
    })
    export class UserPreferenceModule {}
    