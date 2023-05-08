
    import { Injectable, Inject } from '@nestjs/common';
    import { PartStatus } from '../models/partStatus.entity';

    @Injectable()
    export class PartStatusesService {
    constructor(
        @Inject('PARTSTATUS_REPOSITORY')
        private partStatusesRepository: typeof PartStatus,
    ) {}
    
    async findAll(): Promise<PartStatus[]> {
        return this.partStatusesRepository.findAll<PartStatus>();
    }
    }
    