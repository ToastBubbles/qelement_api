
    import { Controller, Get } from '@nestjs/common';
    import { UserPreference } from 'src/models/userPreference.entity';
    import { UserPreferencesService } from '../services/userPreference.service';
    
    @Controller('userPreference')
    export class UserPreferencesController {
      constructor(private readonly userPreferencesService: UserPreferencesService) {}
    
      @Get()
      async getAllUserPreferences(): Promise<UserPreference[]> {
        return this.userPreferencesService.findAll();
      }
    }
    