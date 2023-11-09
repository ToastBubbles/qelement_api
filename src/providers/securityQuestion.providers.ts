
    import { SecurityQuestion } from '../models/securityQuestion.entity';

    export const securityQuestionsProviders = [
    {
        provide: 'SECURITYQUESTION_REPOSITORY',
        useValue: SecurityQuestion,
    },
    ];
    