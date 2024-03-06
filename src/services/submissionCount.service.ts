
    import { Injectable, Inject } from '@nestjs/common';
    import { SubmissionCount } from '../models/submissionCount.entity';

    @Injectable()
    export class SubmissionCountsService {
    constructor(
        @Inject('SUBMISSIONCOUNT_REPOSITORY')
        private submissionCountsRepository: typeof SubmissionCount,
    ) {}
    
    async findAll(): Promise<SubmissionCount[]> {
        return this.submissionCountsRepository.findAll<SubmissionCount>();
    }
    }
    