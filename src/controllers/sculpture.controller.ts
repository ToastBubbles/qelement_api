
    import { Controller, Get } from '@nestjs/common';
    import { Sculpture } from 'src/models/sculpture.entity';
    import { SculpturesService } from '../services/sculpture.service';
    
    @Controller('sculpture')
    export class SculpturesController {
      constructor(private readonly sculpturesService: SculpturesService) {}
    
      @Get()
      async getAllSculptures(): Promise<Sculpture[]> {
        return this.sculpturesService.findAll();
      }
    }
    