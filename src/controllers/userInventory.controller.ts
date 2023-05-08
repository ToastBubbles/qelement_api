
    import { Controller, Get } from '@nestjs/common';
    import { UserInventory } from 'src/models/userInventory.entity';
    import { UserInventoriesService } from '../services/userInventory.service';
    
    @Controller('userInventory')
    export class UserInventoriesController {
      constructor(private readonly userInventoriesService: UserInventoriesService) {}
    
      @Get()
      async getAllUserInventories(): Promise<UserInventory[]> {
        return this.userInventoriesService.findAll();
      }
    }
    