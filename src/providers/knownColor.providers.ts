
    import { KnownColor } from '../models/knownColor.entity';

    export const knownColorsProviders = [
    {
        provide: 'KNOWNCOLOR_REPOSITORY',
        useValue: KnownColor,
    },
    ];
    