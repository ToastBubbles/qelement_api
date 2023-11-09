
    import { Controller, Get } from '@nestjs/common';
    import { SecurityQuestion } from 'src/models/securityQuestion.entity';
    import { SecurityQuestionsService } from '../services/securityQuestion.service';
    
    @Controller('securityQuestion')
    export class SecurityQuestionsController {
      constructor(private readonly securityQuestionsService: SecurityQuestionsService) {}
    
      @Get()
      async getAllSecurityQuestions(): Promise<SecurityQuestion[]> {
        return this.securityQuestionsService.findAll();
      }
    }
    