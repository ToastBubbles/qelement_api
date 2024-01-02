import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Image } from 'src/models/image.entity';
import { ImagesService } from '../services/image.service';
import {
  IAPIResponse,
  iIdAndPrimary,
  iIdAndType,
  iIdOnly,
} from 'src/interfaces/general';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/services/minio.service';
import { UsersService } from 'src/services/user.service';

@Controller('image')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly minioService: MinioService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async getAllImages(): Promise<Image[]> {
    return this.imagesService.findAll();
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<Image[]> {
    return this.imagesService.findAllNotApproved();
  }
  @Post('/markPrimary')
  async markPrimary(@Body() data: iIdAndType): Promise<IAPIResponse> {
    try {
      let thisImage = await this.imagesService.findById(data.id);

      if (thisImage.isPrimary) return { code: 501, message: 'Arleady Primary' };
      if (!thisImage) return { code: 504, message: 'Image not found' };
      let existingImages: Image[] = [];
      if (thisImage.qpartId) {
        existingImages = await this.imagesService.findByQPartID(
          thisImage.qpartId,
        );
      } else if (thisImage.sculptureId) {
        existingImages = await this.imagesService.findBySculptureID(
          thisImage.sculptureId,
        );
      } else {
        return { code: 501, message: 'Generic Error' };
      }
      let existingPrimaryImage = existingImages.find(
        (img) => img.isPrimary == true,
      );
      if (existingPrimaryImage != undefined) {
        await existingPrimaryImage.update({ isPrimary: false });
      }
      await thisImage.update({ isPrimary: true });
      return { code: 200, message: 'Image successfully set as primary' };
    } catch (error) {
      return { code: 500, message: 'Generic Error' };
    }
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Body() data: any,
  ): Promise<IAPIResponse> {
    try {
      let imageData = JSON.parse(data?.imageData);
      console.log(imageData, typeof imageData);
      if (imageData.userId && (imageData.qpartId || imageData.sculptureId)) {
        let user = await this.userService.findOneById(imageData.userId);
        let isAdmin = false;
        if ((user && user?.role == 'admin') || user.role == 'trusted') {
          isAdmin = true;
        }
        await this.minioService.createBucketIfNotExists();
        const fileName = await this.minioService.uploadFile(
          image,
          imageData.qpartId,
          imageData.sculptureId,
          imageData.userId,
          imageData.type,
        );

        let newImage = await Image.create({
          fileName: fileName,
          type: imageData.type,
          userId: imageData.userId,
          qpartId: imageData.qpartId ? imageData.qpartId : undefined,
          sculptureId: imageData.sculptureId
            ? imageData.sculptureId
            : undefined,
          approvalDate: isAdmin
            ? new Date().toISOString().slice(0, 23).replace('T', ' ')
            : null,
        });
        // .catch((e) => {
        //   return { code: 500, message: `generic error` };
        // });
        if (newImage instanceof Image) {
          if (isAdmin) return { code: 202, message: fileName };
          return { code: 201, message: fileName };
        }
      }
      return { code: 2, message: 'failed1' };
    } catch (error) {
      console.log(error);

      return { code: 500, message: error };
    }
  }

  @Get('/name/:fileName')
  async getImageURL(@Param('fileName') fileName: string) {
    const fileUrl = await this.minioService.getFileUrl(fileName);
    return fileUrl;
  }

  @Post('/approve')
  async approveImage(
    @Body()
    data: iIdAndPrimary,
  ): Promise<IAPIResponse> {
    try {
      console.log('data:', data);

      let thisObj = await this.imagesService.findByIdAll(data.id);
      if (thisObj) {
        if (!data.isPrimary) {
          console.log('updating date only');

          thisObj.update({
            approvalDate: new Date()
              .toISOString()
              .slice(0, 23)
              .replace('T', ' '),
          });
          return { code: 200, message: `approved` };
        } else {
          console.log('updating with primary');

          let existingImages: Image[] = [];
          if (thisObj.qpartId) {
            existingImages = await this.imagesService.findByQPartID(
              thisObj.qpartId,
            );
          } else if (thisObj.sculptureId) {
            existingImages = await this.imagesService.findBySculptureID(
              thisObj.sculptureId,
            );
          } else {
            return { code: 501, message: 'Generic Error' };
          }
          let existingPrimaryImage = existingImages.find(
            (img) => img.isPrimary == true,
          );
          console.log('existing primary', existingPrimaryImage);

          if (existingPrimaryImage != undefined) {
            await existingPrimaryImage.update({ isPrimary: false });
          }
          thisObj.update({
            isPrimary: true,
            approvalDate: new Date()
              .toISOString()
              .slice(0, 23)
              .replace('T', ' '),
          });
          return { code: 200, message: `approved and set as primary` };
        }
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/delete')
  async deleteCategory(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.imagesService.findByIdAll(data.id);
      if (thisObj) {
        thisObj.destroy();
        return { code: 200, message: `deleted` };
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
