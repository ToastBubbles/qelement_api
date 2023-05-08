
    import { Injectable, Inject } from '@nestjs/common';
    import { UserPreference } from '../models/userPreference.entity';

    @Injectable()
    export class UserPreferencesService {
    constructor(
        @Inject('USERPREFERENCE_REPOSITORY')
        private userPreferencesRepository: typeof UserPreference,
    ) {}
    
    async findAll(): Promise<UserPreference[]> {
        return this.userPreferencesRepository.findAll<UserPreference>();
    }
    }
    