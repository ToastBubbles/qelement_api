
    import { Injectable, Inject } from '@nestjs/common';
    import { ElementID } from '../models/elementID.entity';

    @Injectable()
    export class ElementIDsService {
    constructor(
        @Inject('ELEMENTID_REPOSITORY')
        private elementIDsRepository: typeof ElementID,
    ) {}
    
    async findAll(): Promise<ElementID[]> {
        return this.elementIDsRepository.findAll<ElementID>();
    }
    }
    