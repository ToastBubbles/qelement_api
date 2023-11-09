
    import { Injectable, Inject } from '@nestjs/common';
    import { PredefinedSecurityQuestion } from '../models/predefinedSecurityQuestion.entity';

    @Injectable()
    export class PredefinedSecurityQuestionsService {
    constructor(
        @Inject('PREDEFINEDSECURITYQUESTION_REPOSITORY')
        private predefinedSecurityQuestionsRepository: typeof PredefinedSecurityQuestion,
    ) {}
    
    async findAll(): Promise<PredefinedSecurityQuestion[]> {
        return this.predefinedSecurityQuestionsRepository.findAll<PredefinedSecurityQuestion>();
    }
    }
    