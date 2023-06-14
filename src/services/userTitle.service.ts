
    import { Injectable, Inject } from '@nestjs/common';
    import { UserTitle } from '../models/userTitle.entity';

    @Injectable()
    export class UsertitlesService {
    constructor(
        @Inject('USERTITLE_REPOSITORY')
        private usertitlesRepository: typeof UserTitle,
    ) {}
    
    async findAll(): Promise<UserTitle[]> {
        return this.usertitlesRepository.findAll<UserTitle>();
    }
    }
    