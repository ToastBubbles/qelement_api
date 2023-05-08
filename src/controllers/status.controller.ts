
    import { Controller, Get } from '@nestjs/common';
    import { Status } from 'src/models/status.entity';
    import { StatusesService } from '../services/status.service';
    
    @Controller('status')
    export class StatusesController {
      constructor(private readonly statusesService: StatusesService) {}
    
      @Get()
      async getAllStatuses(): Promise<Status[]> {
        return this.statusesService.findAll();
      }
    }
    