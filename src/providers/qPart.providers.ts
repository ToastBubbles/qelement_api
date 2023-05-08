
    import { QPart } from '../models/qPart.entity';

    export const qPartsProviders = [
    {
        provide: 'QPART_REPOSITORY',
        useValue: QPart,
    },
    ];
    