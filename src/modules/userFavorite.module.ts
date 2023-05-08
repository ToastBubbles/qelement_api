
    import { Module } from '@nestjs/common';
    import { UserFavoritesController } from '../controllers/userFavorite.controller';
    import { UserFavoritesService } from '../services/userFavorite.service';
    import { userFavoritesProviders } from '../providers/userFavorite.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [UserFavoritesController],
    providers: [UserFavoritesService, ...userFavoritesProviders],
    })
    export class UserFavoriteModule {}
    