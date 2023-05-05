
    import { Controller, Get } from '@nestjs/common';
    import { Color } from 'src/models/color.entity';
    import { ColorsService } from '../services/color.service';
    
    @Controller('color')
    export class ColorsController {
      constructor(private readonly colorsService: ColorsService) {}
    
      @Get()
      async getAllColors(): Promise<Color[]> {
        return this.colorsService.findAll();
      }
    }
    