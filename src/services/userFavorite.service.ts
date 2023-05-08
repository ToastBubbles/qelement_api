
    import { Injectable, Inject } from '@nestjs/common';
    import { UserFavorite } from '../models/userFavorite.entity';

    @Injectable()
    export class UserFavoritesService {
    constructor(
        @Inject('USERFAVORITE_REPOSITORY')
        private userFavoritesRepository: typeof UserFavorite,
    ) {}
    
    async findAll(): Promise<UserFavorite[]> {
        return this.userFavoritesRepository.findAll<UserFavorite>();
    }
    }
    