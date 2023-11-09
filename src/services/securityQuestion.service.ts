import { Injectable, Inject } from '@nestjs/common';
import { SecurityQuestion } from '../models/securityQuestion.entity';

@Injectable()
export class SecurityQuestionsService {
  constructor(
    @Inject('SECURITYQUESTION_REPOSITORY')
    private securityQuestionsRepository: typeof SecurityQuestion,
  ) {}

  async findAll(): Promise<SecurityQuestion[]> {
    return this.securityQuestionsRepository.findAll<SecurityQuestion>();
  }

  async findById(id: number): Promise<SecurityQuestion | null> {
    return this.securityQuestionsRepository.findOne<SecurityQuestion>({
      where: { id: id },
    });
  }
}
