
    import { PartStatus } from '../models/partStatus.entity';

    export const partStatusesProviders = [
    {
        provide: 'PARTSTATUS_REPOSITORY',
        useValue: PartStatus,
    },
    ];
    