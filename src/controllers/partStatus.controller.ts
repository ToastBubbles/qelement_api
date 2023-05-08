
    import { Controller, Get } from '@nestjs/common';
    import { PartStatus } from 'src/models/partStatus.entity';
    import { PartStatusesService } from '../services/partStatus.service';
    
    @Controller('partStatus')
    export class PartStatusesController {
      constructor(private readonly partStatusesService: PartStatusesService) {}
    
      @Get()
      async getAllPartStatuses(): Promise<PartStatus[]> {
        return this.partStatusesService.findAll();
      }
    }
    