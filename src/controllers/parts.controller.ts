import { Controller, Get } from '@nestjs/common';
import { Part } from 'src/models/part.entity';
import { PartsService } from '../services/parts.service';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get()
  async getAllParts(): Promise<Part[]> {
    return this.partsService.findAll();
  }
}
