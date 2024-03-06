import { SubmissionCount } from 'src/models/submissionCount.entity';

export const submissionCountsProviders = [
  {
    provide: 'SUBMISSIONCOUNT_REPOSITORY',
    useValue: SubmissionCount,
  },
];
