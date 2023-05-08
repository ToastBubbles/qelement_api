
    import { PriceHistory } from '../models/priceHistory.entity';

    export const priceHistoriesProviders = [
    {
        provide: 'PRICEHISTORY_REPOSITORY',
        useValue: PriceHistory,
    },
    ];
    