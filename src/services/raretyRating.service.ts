
    import { Injectable, Inject } from '@nestjs/common';
    import { RaretyRating } from '../models/raretyRating.entity';

    @Injectable()
    export class RaretyRatingsService {
    constructor(
        @Inject('RARETYRATING_REPOSITORY')
        private raretyRatingsRepository: typeof RaretyRating,
    ) {}
    
    async findAll(): Promise<RaretyRating[]> {
        return this.raretyRatingsRepository.findAll<RaretyRating>();
    }
    }
    