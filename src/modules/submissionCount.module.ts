
    import { Module } from '@nestjs/common';
import { SubmissionCountsController } from 'src/controllers/submissionCount.controller';
import { submissionCountsProviders } from 'src/providers/submissionCount.providers';
import { SubmissionCountsService } from 'src/services/submissionCount.service';
import { DatabaseModule } from './database.module';


    @Module({
    imports: [DatabaseModule],
    controllers: [SubmissionCountsController],
    providers: [SubmissionCountsService, ...submissionCountsProviders],
    })
    export class SubmissionCountModule {}
    