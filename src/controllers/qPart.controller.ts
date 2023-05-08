
    import { Controller, Get } from '@nestjs/common';
    import { QPart } from 'src/models/qPart.entity';
    import { QPartsService } from '../services/qPart.service';
    
    @Controller('qPart')
    export class QPartsController {
      constructor(private readonly qPartsService: QPartsService) {}
    
      @Get()
      async getAllQParts(): Promise<QPart[]> {
        return this.qPartsService.findAll();
      }
    }
    