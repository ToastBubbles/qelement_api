import { Injectable, Inject } from '@nestjs/common';
import { UserFavorite } from '../models/userFavorite.entity';
import { QPart } from 'src/models/qPart.entity';
import { PartMold } from 'src/models/partMold.entity';
import { Part } from 'src/models/part.entity';
import { Color } from 'src/models/color.entity';
import { Image } from 'src/models/image.entity';
import { PartStatus } from 'src/models/partStatus.entity';
import { RaretyRating } from 'src/models/raretyRating.entity';

@Injectable()
export class UserFavoritesService {
  constructor(
    @Inject('USERFAVORITE_REPOSITORY')
    private userFavoritesRepository: typeof UserFavorite,
  ) {}

  async findAll(): Promise<UserFavorite[]> {
    return this.userFavoritesRepository.findAll<UserFavorite>();
  }

  async findAllByUserId(userId: number): Promise<UserFavorite[]> {
    return this.userFavoritesRepository.findAll<UserFavorite>({
      include: [
        {
          model: QPart,
          include: [
            {
              model: PartMold,
              include: [Part],
              required: true,
              duplicating: false,
            },
            Color,
            Image,
            PartStatus,
            RaretyRating,
          ],
          required: true,
          duplicating: false,
        },
      ],
      where: { userId: userId },
    });
  }

  async getTopFive(id: number): Promise<UserFavorite[]> {
    return this.userFavoritesRepository.findAll<UserFavorite>({
      where: {
        userId: id,
        type: 'topfive',
      },
    });
  }
}
