
    import { Module } from '@nestjs/common';
    import { UserGoalsController } from '../controllers/userGoal.controller';
    import { UserGoalsService } from '../services/userGoal.service';
    import { userGoalsProviders } from '../providers/userGoal.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [UserGoalsController],
    providers: [UserGoalsService, ...userGoalsProviders],
    })
    export class UserGoalModule {}
    