
    import { Injectable, Inject } from '@nestjs/common';
    import { Status } from '../models/status.entity';

    @Injectable()
    export class StatusesService {
    constructor(
        @Inject('STATUS_REPOSITORY')
        private statusesRepository: typeof Status,
    ) {}
    
    async findAll(): Promise<Status[]> {
        return this.statusesRepository.findAll<Status>();
    }
    }
    