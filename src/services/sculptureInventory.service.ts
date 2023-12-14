
    import { Injectable, Inject } from '@nestjs/common';
    import { SculptureInventory } from '../models/sculptureInventory.entity';

    @Injectable()
    export class SculptureInventoriesService {
    constructor(
        @Inject('SCULPTUREINVENTORY_REPOSITORY')
        private sculptureInventoriesRepository: typeof SculptureInventory,
    ) {}
    
    async findAll(): Promise<SculptureInventory[]> {
        return this.sculptureInventoriesRepository.findAll<SculptureInventory>();
    }
    }
    