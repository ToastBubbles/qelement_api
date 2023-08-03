import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ElementID } from 'src/models/elementID.entity';
import { ElementIDsService } from '../services/elementID.service';
import {
  IAPIResponse,
  IElementIDCreationDTO,
  ISearchOnly,
} from 'src/interfaces/general';

@Controller('elementID')
export class ElementIDsController {
  constructor(private readonly elementIDsService: ElementIDsService) {}

  @Get()
  async getAllElementIDs(): Promise<ElementID[]> {
    return this.elementIDsService.findAll();
  }

  @Get('/search')
  async getSearchResults(
    @Query() data: ISearchOnly,
  ): Promise<ElementID[] | null> {
    try {
      return this.elementIDsService.findPartsBySearch(data.search);
    } catch (error) {
      return null;
    }
  }

  @Post('/add')
  async addElementID(
    @Body()
    elementID: IElementIDCreationDTO,
  ): Promise<IAPIResponse> {
    try {
      let newElementID = ElementID.create({
        number: elementID.number,
        creatorId: elementID.creatorId,
        qpartId: elementID.qpartId,
      }).catch((e) => {
        return { code: 502, message: `generic error` };
      });
      if (newElementID instanceof ElementID) {
        return { code: 200, message: 'success' };
      }
      return { code: 501, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }
}
