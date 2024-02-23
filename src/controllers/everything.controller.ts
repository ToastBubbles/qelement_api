import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  IAPIResponse,
  INotApporvedCounts,
  Public,
} from 'src/interfaces/general';

import { Color } from 'src/models/color.entity';
import { colors } from '../utils/colorData';
import { SimilarColor } from 'src/models/similarColor.entity';
import { ColorsService } from 'src/services/color.service';
import { CategoriesService } from 'src/services/category.service';
import { PartsService } from 'src/services/parts.service';
import { PartMoldsService } from 'src/services/partMold.service';
import { QPartsService } from 'src/services/qPart.service';
import { PartStatusesService } from 'src/services/partStatus.service';
import { SimilarColorsService } from 'src/services/similarColor.service';
import { ImagesService } from 'src/services/image.service';
import { SculpturesService } from 'src/services/sculpture.service';
import { ElementIDsService } from 'src/services/elementID.service';
import { SculptureInventoriesService } from 'src/services/sculptureInventory.service';
import { AdminMiddleware } from 'src/auth/admin.middleware';
import { User } from 'src/models/user.entity';

@Controller('extra')
export class EverythingController {
  constructor(
    private readonly colorsService: ColorsService,
    private readonly categoriesService: CategoriesService,
    private readonly partsService: PartsService,
    private readonly partMoldsService: PartMoldsService,
    private readonly qelementsService: QPartsService,
    private readonly partStatusService: PartStatusesService,
    private readonly similarColorsService: SimilarColorsService,
    private readonly imagesService: ImagesService,
    private readonly sculpturesService: SculpturesService,
    private readonly sculptureInventoriesService: SculptureInventoriesService,
    private readonly elementIDsService: ElementIDsService,
  ) {}

  @Public()
  @Post('/addAllColors')
  async addAllColors(@Req() req: any): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 501, message: `User not found` };
      if (user.role != 'admin')
        return { code: 403, message: 'User is not admin' };
      colors.forEach((color) => {
        Color.create({
          bl_name: color.BLName,
          tlg_name: color.LName,
          bo_name: color.OName,
          hex: color.color || '000000',
          swatchId: color.swatchId || null,
          bl_id: Number(color.id) || null,
          tlg_id: Number(color.Lid) || null,
          bo_id: Number(color.Oid) || null,
          type: color.type,
          note: color.note || '',
          isOfficial: true,
          approvalDate: new Date().toISOString().slice(0, 23).replace('T', ' '),
          creatorId: userId,
        });
      });

      return { code: 200, message: 'Colors added' };
    } catch (e) {
      console.log(e);
      return { code: 500, message: `generic error` };
    }
  }

  @Public()
  @Get('/getNotApprovedCounts')
  async getNotApprovedCounts(): Promise<INotApporvedCounts> {
    return {
      colors: (await this.colorsService.findAllNotApproved()).length,
      categories: (await this.categoriesService.findAllNotApproved()).length,
      parts: (await this.partsService.findAllNotApproved()).length,
      partMolds: (await this.partMoldsService.findAllNotApproved()).length,
      qelements: (await this.qelementsService.findAllNotApproved()).length,
      partStatuses: (await this.partStatusService.findAllNotApproved()).length,
      similarColors: (await this.similarColorsService.findAllNotApproved())
        .length,
      images: (await this.imagesService.findAllNotApproved()).length,
      sculptures: (await this.sculpturesService.findAllNotApproved()).length,
      sculptureInventories: (
        await this.sculptureInventoriesService.findAllNotApproved()
      ).length,
      elementIDs: (await this.elementIDsService.findAllNotApproved()).length,
    };
  }
}
