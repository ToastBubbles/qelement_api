
    import { UserInventory } from '../models/userInventory.entity';

    export const userInventoriesProviders = [
    {
        provide: 'USERINVENTORY_REPOSITORY',
        useValue: UserInventory,
    },
    ];
    