
    import { Module } from '@nestjs/common';
    import { PredefinedSecurityQuestionsController } from '../controllers/predefinedSecurityQuestion.controller';
    import { PredefinedSecurityQuestionsService } from '../services/predefinedSecurityQuestion.service';
    import { predefinedSecurityQuestionsProviders } from '../providers/predefinedSecurityQuestion.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [PredefinedSecurityQuestionsController],
    providers: [PredefinedSecurityQuestionsService, ...predefinedSecurityQuestionsProviders],
    })
    export class PredefinedSecurityQuestionModule {}
    