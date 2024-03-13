import { Controller, Get } from '@nestjs/common';
import { MarbledPartColor } from 'src/models/marbledPartColor.entity';
import { MarbledPartColorsService } from 'src/services/marbledPartColor.service';

@Controller('marbledPartColor')
export class MarbledPartColorsController {
  constructor(
    private readonly marbledPartColorsService: MarbledPartColorsService,
  ) {}

  @Get()
  async getAllMarbledPartColors(): Promise<MarbledPartColor[]> {
    return this.marbledPartColorsService.findAll();
  }
}
