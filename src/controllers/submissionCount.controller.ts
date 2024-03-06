import { Controller, Get } from '@nestjs/common';
import { SubmissionCount } from 'src/models/submissionCount.entity';
import { SubmissionCountsService } from 'src/services/submissionCount.service';

@Controller('submissionCount')
export class SubmissionCountsController {
  constructor(
    private readonly submissionCountsService: SubmissionCountsService,
  ) {}

  @Get()
  async getAllSubmissionCounts(): Promise<SubmissionCount[]> {
    return this.submissionCountsService.findAll();
  }
}
