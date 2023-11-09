
    import { Controller, Get } from '@nestjs/common';
    import { PredefinedSecurityQuestion } from 'src/models/predefinedSecurityQuestion.entity';
    import { PredefinedSecurityQuestionsService } from '../services/predefinedSecurityQuestion.service';
    
    @Controller('predefinedSecurityQuestion')
    export class PredefinedSecurityQuestionsController {
      constructor(private readonly predefinedSecurityQuestionsService: PredefinedSecurityQuestionsService) {}
    
      @Get()
      async getAllPredefinedSecurityQuestions(): Promise<PredefinedSecurityQuestion[]> {
        return this.predefinedSecurityQuestionsService.findAll();
      }
    }
    