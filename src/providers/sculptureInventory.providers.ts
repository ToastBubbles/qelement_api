
    import { SculptureInventory } from '../models/sculptureInventory.entity';

    export const sculptureInventoriesProviders = [
    {
        provide: 'SCULPTUREINVENTORY_REPOSITORY',
        useValue: SculptureInventory,
    },
    ];
    