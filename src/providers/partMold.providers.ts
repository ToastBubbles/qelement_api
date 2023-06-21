
    import { PartMold } from '../models/partMold.entity';

    export const partMoldsProviders = [
    {
        provide: 'PARTMOLD_REPOSITORY',
        useValue: PartMold,
    },
    ];
    