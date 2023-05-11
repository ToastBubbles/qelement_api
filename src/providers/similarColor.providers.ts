
    import { SimilarColor } from '../models/similarColor.entity';

    export const similarColorsProviders = [
    {
        provide: 'SIMILARCOLOR_REPOSITORY',
        useValue: SimilarColor,
    },
    ];
    