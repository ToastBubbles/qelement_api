
    import { Injectable, Inject } from '@nestjs/common';
    import { SculptureColor } from '../models/sculptureColor.entity';

    @Injectable()
    export class SculptureColorsService {
    constructor(
        @Inject('SCULPTURECOLOR_REPOSITORY')
        private sculptureColorsRepository: typeof SculptureColor,
    ) {}
    
    async findAll(): Promise<SculptureColor[]> {
        return this.sculptureColorsRepository.findAll<SculptureColor>();
    }
    }
    