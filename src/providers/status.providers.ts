
    import { Status } from '../models/status.entity';

    export const statusesProviders = [
    {
        provide: 'STATUS_REPOSITORY',
        useValue: Status,
    },
    ];
    