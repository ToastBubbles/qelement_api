
    import { UserPreference } from '../models/userPreference.entity';

    export const userPreferencesProviders = [
    {
        provide: 'USERPREFERENCE_REPOSITORY',
        useValue: UserPreference,
    },
    ];
    