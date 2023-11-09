
    import { PredefinedSecurityQuestion } from '../models/predefinedSecurityQuestion.entity';

    export const predefinedSecurityQuestionsProviders = [
    {
        provide: 'PREDEFINEDSECURITYQUESTION_REPOSITORY',
        useValue: PredefinedSecurityQuestion,
    },
    ];
    