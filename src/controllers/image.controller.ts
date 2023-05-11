
    import { Controller, Get } from '@nestjs/common';
    import { Image } from 'src/models/image.entity';
    import { ImagesService } from '../services/image.service';
    
    
    @Controller('image')
    export class ImagesController {
      constructor(private readonly imagesService: ImagesService) {}
    
      @Get()
      async getAllImages(): Promise<Image[]> {
        return this.imagesService.findAll();
      }
    }
    