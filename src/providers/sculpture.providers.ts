
    import { Sculpture } from '../models/sculpture.entity';

    export const sculpturesProviders = [
    {
        provide: 'SCULPTURE_REPOSITORY',
        useValue: Sculpture,
    },
    ];
    