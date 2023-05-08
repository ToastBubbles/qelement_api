
    import { Controller, Get } from '@nestjs/common';
    import { KnownColor } from 'src/models/knownColor.entity';
    import { KnownColorsService } from '../services/knownColor.service';
    
    @Controller('knownColor')
    export class KnownColorsController {
      constructor(private readonly knownColorsService: KnownColorsService) {}
    
      @Get()
      async getAllKnownColors(): Promise<KnownColor[]> {
        return this.knownColorsService.findAll();
      }
    }
    