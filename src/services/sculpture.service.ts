
    import { Injectable, Inject } from '@nestjs/common';
    import { Sculpture } from '../models/sculpture.entity';

    @Injectable()
    export class SculpturesService {
    constructor(
        @Inject('SCULPTURE_REPOSITORY')
        private sculpturesRepository: typeof Sculpture,
    ) {}
    
    async findAll(): Promise<Sculpture[]> {
        return this.sculpturesRepository.findAll<Sculpture>();
    }
    }
    