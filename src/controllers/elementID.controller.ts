import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ElementID } from 'src/models/elementID.entity';
import { ElementIDsService } from '../services/elementID.service';
import {
  IAPIResponse,
  IElementIDCreationDTO,
  ISearchOnly,
} from 'src/interfaces/general';
import { UsersService } from 'src/services/user.service';

@Controller('elementID')
export class ElementIDsController {
  constructor(
    private readonly elementIDsService: ElementIDsService,
    private readonly userService: UsersService,
  ) {}

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
      let user = await this.userService.findOneById(elementID.creatorId);
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      let newElementID = await ElementID.create({
        number: elementID.number,
        creatorId: elementID.creatorId,
        qpartId: elementID.qpartId,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      }).catch((e) => {
        return { code: 502, message: `generic error` };
      });
      console.log(newElementID);
      console.log(newElementID instanceof ElementID);

      if (newElementID instanceof ElementID) {
        if (isAdmin) return { code: 201, message: 'approved' };
        else return { code: 200, message: 'submitted' };
      }
      return { code: 501, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }
}
