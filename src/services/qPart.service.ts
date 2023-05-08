
    import { Injectable, Inject } from '@nestjs/common';
    import { QPart } from '../models/qPart.entity';

    @Injectable()
    export class QPartsService {
    constructor(
        @Inject('QPART_REPOSITORY')
        private qPartsRepository: typeof QPart,
    ) {}
    
    async findAll(): Promise<QPart[]> {
        return this.qPartsRepository.findAll<QPart>();
    }
    }
    