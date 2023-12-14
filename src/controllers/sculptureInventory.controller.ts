
    import { Controller, Get } from '@nestjs/common';
    import { SculptureInventory } from 'src/models/sculptureInventory.entity';
    import { SculptureInventoriesService } from '../services/sculptureInventory.service';
    
    @Controller('sculptureInventory')
    export class SculptureInventoriesController {
      constructor(private readonly sculptureInventoriesService: SculptureInventoriesService) {}
    
      @Get()
      async getAllSculptureInventories(): Promise<SculptureInventory[]> {
        return this.sculptureInventoriesService.findAll();
      }
    }
    