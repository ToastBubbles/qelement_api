
    import { Injectable, Inject } from '@nestjs/common';
    import { KnownColor } from '../models/knownColor.entity';

    @Injectable()
    export class KnownColorsService {
    constructor(
        @Inject('KNOWNCOLOR_REPOSITORY')
        private knownColorsRepository: typeof KnownColor,
    ) {}
    
    async findAll(): Promise<KnownColor[]> {
        return this.knownColorsRepository.findAll<KnownColor>();
    }
    }
    