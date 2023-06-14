
    import { Title } from '../models/title.entity';

    export const titlesProviders = [
    {
        provide: 'TITLE_REPOSITORY',
        useValue: Title,
    },
    ];
    