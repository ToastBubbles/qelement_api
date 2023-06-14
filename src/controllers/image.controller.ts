import { Controller, Get, Param } from '@nestjs/common';
import { Image } from 'src/models/image.entity';
import { ImagesService } from '../services/image.service';

@Controller('image')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAllImages(): Promise<Image[]> {
    return this.imagesService.findAll();
  }

  @Get('/id/:id')
  async getImagesById(@Param('id') id: number): Promise<Image[]> {
    return this.imagesService.findAllById(id);
  }
}
