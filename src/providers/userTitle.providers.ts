
    import { UserTitle } from '../models/userTitle.entity';

    export const usertitlesProviders = [
    {
        provide: 'USERTITLE_REPOSITORY',
        useValue: UserTitle,
    },
    ];
    