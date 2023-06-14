
    import { Injectable, Inject } from '@nestjs/common';
    import { Title } from '../models/title.entity';

    @Injectable()
    export class TitlesService {
    constructor(
        @Inject('TITLE_REPOSITORY')
        private titlesRepository: typeof Title,
    ) {}
    
    async findAll(): Promise<Title[]> {
        return this.titlesRepository.findAll<Title>();
    }
    }
    