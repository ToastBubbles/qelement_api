
    import { UserFavorite } from '../models/userFavorite.entity';

    export const userFavoritesProviders = [
    {
        provide: 'USERFAVORITE_REPOSITORY',
        useValue: UserFavorite,
    },
    ];
    