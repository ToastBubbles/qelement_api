import { Body, Controller, Get, Post } from '@nestjs/common';
import { SecurityQuestion } from 'src/models/securityQuestion.entity';
import { SecurityQuestionsService } from '../services/securityQuestion.service';
import { IAPIResponse, ISecurityQuestionDTO } from 'src/interfaces/general';
import * as bcrypt from 'bcrypt';
@Controller('securityQuestion')
export class SecurityQuestionsController {
  constructor(
    private readonly securityQuestionsService: SecurityQuestionsService,
  ) {}

  @Get()
  async getAllSecurityQuestions(): Promise<SecurityQuestion[]> {
    return this.securityQuestionsService.findAll();
  }

  @Post('/check')
  async checkAnswer(
    @Body()
    answerDTO: ISecurityQuestionDTO,
  ): Promise<IAPIResponse> {
    console.log(answerDTO);

    // const salt = await bcrypt.genSalt();

    // const hash = await bcrypt.hash(answerDTO.answer.toLowerCase(), salt);

    // console.log(hash);

    let obj = await this.securityQuestionsService.findById(
      answerDTO.questionId,
    );
    if (obj) {
      const isMatch = await bcrypt.compare(
        answerDTO.answer.toLowerCase(),
        obj.answer,
      );
    
      if (isMatch) {
        return { code: 200, message: 'answered correctly' };
      } else {
        return { code: 403, message: 'incorrect' };
      }
    }
    return { code: 404, message: 'no object found' };
    // return this.securityQuestionsService.findAll();
  }
}
