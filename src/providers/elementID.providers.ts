
    import { ElementID } from '../models/elementID.entity';

    export const elementIDsProviders = [
    {
        provide: 'ELEMENTID_REPOSITORY',
        useValue: ElementID,
    },
    ];
    