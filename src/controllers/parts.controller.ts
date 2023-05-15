import { Controller, Get, Param } from '@nestjs/common';
import { Part } from 'src/models/part.entity';
import { PartsService } from '../services/parts.service';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get()
  async getAllParts(): Promise<Part[]> {
    return this.partsService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id') id: number): Promise<Part | null> {
    return this.partsService.findById(id);
  }
  @Get('/add')
  async addTestPart(): Promise<Part> {
    let newPart = new Part({
      name: 'Brick, 2 x 4',
      number: '3001',
      CatId: 2,
    });
    newPart.save();
    return newPart;
  }
}
