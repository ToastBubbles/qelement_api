import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Image } from 'src/models/image.entity';
import { ImagesService } from '../services/image.service';
import { IAPIResponse, iIdOnly } from 'src/interfaces/general';

@Controller('image')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAllImages(): Promise<Image[]> {
    return this.imagesService.findAll();
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<Image[]> {
    return this.imagesService.findAllNotApproved();
  }

  @Post('/approve')
  async approveImage(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.imagesService.findById(data.id);
      if (thisObj) {
        thisObj.update({
          approvalDate: new Date().toISOString().slice(0, 23).replace('T', ' '),
        });
        return { code: 200, message: `approved` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Get('/id/:id')
  async getImagesById(@Param('id') id: number): Promise<Image[]> {
    return this.imagesService.findAllById(id);
  }
}
