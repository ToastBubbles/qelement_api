import { Body, Controller, Get, Post } from '@nestjs/common';
import { ElementID } from 'src/models/elementID.entity';
import { ElementIDsService } from '../services/elementID.service';
import { IAPIResponse, IElementIDCreationDTO } from 'src/interfaces/general';

@Controller('elementID')
export class ElementIDsController {
  constructor(private readonly elementIDsService: ElementIDsService) {}

  @Get()
  async getAllElementIDs(): Promise<ElementID[]> {
    return this.elementIDsService.findAll();
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
