
    import { Injectable, Inject } from '@nestjs/common';
    import { Color } from '../models/color.entity';

    @Injectable()
    export class ColorsService {
    constructor(
        @Inject('COLOR_REPOSITORY')
        private colorsRepository: typeof Color,
    ) {}
    
    async findAll(): Promise<Color[]> {
        return this.colorsRepository.findAll<Color>();
    }
    }
    