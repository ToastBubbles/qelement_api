
    import { UserGoal } from '../models/userGoal.entity';

    export const userGoalsProviders = [
    {
        provide: 'USERGOAL_REPOSITORY',
        useValue: UserGoal,
    },
    ];
    