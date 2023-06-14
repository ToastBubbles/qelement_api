
    import { Controller, Get } from '@nestjs/common';
    import { Title } from 'src/models/title.entity';
    import { TitlesService } from '../services/title.service';
    
    @Controller('title')
    export class TitlesController {
      constructor(private readonly titlesService: TitlesService) {}
    
      @Get()
      async getAllTitles(): Promise<Title[]> {
        return this.titlesService.findAll();
      }
    }
    