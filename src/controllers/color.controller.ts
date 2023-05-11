import { Controller, Get } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { IQelementError } from 'src/interfaces/error';
import { Color } from 'src/models/color.entity';
import { ColorsService } from '../services/color.service';

@Controller('color')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  async getAllColors(): Promise<Color[]> {
    return this.colorsService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Color | IQelementError> {
    return this.colorsService.findById(id);
  }
}
