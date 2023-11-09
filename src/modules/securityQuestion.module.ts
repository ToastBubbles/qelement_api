
    import { Module } from '@nestjs/common';
    import { SecurityQuestionsController } from '../controllers/securityQuestion.controller';
    import { SecurityQuestionsService } from '../services/securityQuestion.service';
    import { securityQuestionsProviders } from '../providers/securityQuestion.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [SecurityQuestionsController],
    providers: [SecurityQuestionsService, ...securityQuestionsProviders],
    })
    export class SecurityQuestionModule {}
    