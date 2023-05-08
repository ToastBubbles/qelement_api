
    import { RaretyRating } from '../models/raretyRating.entity';

    export const raretyRatingsProviders = [
    {
        provide: 'RARETYRATING_REPOSITORY',
        useValue: RaretyRating,
    },
    ];
    