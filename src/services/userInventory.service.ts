
    import { Injectable, Inject } from '@nestjs/common';
    import { UserInventory } from '../models/userInventory.entity';

    @Injectable()
    export class UserInventoriesService {
    constructor(
        @Inject('USERINVENTORY_REPOSITORY')
        private userInventoriesRepository: typeof UserInventory,
    ) {}
    
    async findAll(): Promise<UserInventory[]> {
        return this.userInventoriesRepository.findAll<UserInventory>();
    }
    }
    