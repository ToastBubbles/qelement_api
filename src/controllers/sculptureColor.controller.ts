
    import { Controller, Get } from '@nestjs/common';
    import { SculptureColor } from 'src/models/sculptureColor.entity';
    import { SculptureColorsService } from '../services/sculptureColor.service';
    
    @Controller('sculptureColor')
    export class SculptureColorsController {
      constructor(private readonly sculptureColorsService: SculptureColorsService) {}
    
      @Get()
      async getAllSculptureColors(): Promise<SculptureColor[]> {
        return this.sculptureColorsService.findAll();
      }
    }
    