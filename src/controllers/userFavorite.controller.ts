
    import { Controller, Get } from '@nestjs/common';
    import { UserFavorite } from 'src/models/userFavorite.entity';
    import { UserFavoritesService } from '../services/userFavorite.service';
    
    @Controller('userFavorite')
    export class UserFavoritesController {
      constructor(private readonly userFavoritesService: UserFavoritesService) {}
    
      @Get()
      async getAllUserFavorites(): Promise<UserFavorite[]> {
        return this.userFavoritesService.findAll();
      }
    }
    