import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserFavorite } from 'src/models/userFavorite.entity';
import { UserFavoritesService } from '../services/userFavorite.service';
import {
  IAPIResponse,
  IDeletionDTO,

  IWantedDTO,
} from 'src/interfaces/general';

@Controller('userFavorite')
export class UserFavoritesController {
  constructor(private readonly userFavoritesService: UserFavoritesService) {}

  @Get()
  async getAllUserFavorites(): Promise<UserFavorite[]> {
    return this.userFavoritesService.findAll();
  }

  @Get('/id/:userid')
  async getUserFavoriteByUserId(
    @Param('userid') userId: number,
  ): Promise<UserFavorite[]> {
    return this.userFavoritesService.findAllByUserId(userId);
  }

  @Post('/add')
  async addWantedItem(
    @Body()
    wantedDTO: IWantedDTO,
  ): Promise<IAPIResponse> {
    try {
      let failed = false;
      if (wantedDTO.type == 'topfive') {
        let totalInFavorites = await this.userFavoritesService.getTopFive(
          wantedDTO.userId,
        );
        if (totalInFavorites.length >= 5) {
          return { code: 502, message: `Too many in Top 5` };
        }
      }
      let newWantedItem = await UserFavorite.create({
        type: wantedDTO.type.toLowerCase(),
        userId: wantedDTO.userId,
        qpartId: wantedDTO.qpartId,
      }).catch((e) => {
        console.log(e);
        console.log(wantedDTO);

        failed = true;
      });

      if (newWantedItem instanceof UserFavorite) {
        return { code: 200, message: 'success' };
      }
      if (failed) {
        return { code: 501, message: `Already Exists` };
      }
      return { code: 500, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }

  @Post('/remove')
  async removeWantedItem(
    @Body()
    wantedDTO: IDeletionDTO,
  ): Promise<IAPIResponse> {
    try {
      const itemToRemove = await this.userFavoritesService.findByIdAndUserId(
        wantedDTO,
      );
      if (itemToRemove) {
        itemToRemove.destroy();
        return { code: 200, message: `deleted` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }
}
