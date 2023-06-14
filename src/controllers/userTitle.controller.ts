
    import { Controller, Get } from '@nestjs/common';
    import { UserTitle } from 'src/models/userTitle.entity';
    import { UsertitlesService } from '../services/userTitle.service';
    
    @Controller('userTitle')
    export class UsertitlesController {
      constructor(private readonly usertitlesService: UsertitlesService) {}
    
      @Get()
      async getAllUsertitles(): Promise<UserTitle[]> {
        return this.usertitlesService.findAll();
      }
    }
    