import { Injectable, Inject } from '@nestjs/common';
import { SculptureInventory } from '../models/sculptureInventory.entity';
import { Sculpture } from 'src/models/sculpture.entity';
import { QPart } from 'src/models/qPart.entity';
import { PartMold } from 'src/models/partMold.entity';
import { Part } from 'src/models/part.entity';
import { PartStatus } from 'src/models/partStatus.entity';
import { Image } from 'src/models/image.entity';
import { Color } from 'src/models/color.entity';
import { User } from 'src/models/user.entity';

@Injectable()
export class SculptureInventoriesService {
  constructor(
    @Inject('SCULPTUREINVENTORY_REPOSITORY')
    private sculptureInventoriesRepository: typeof SculptureInventory,
  ) {}

  async findAll(): Promise<SculptureInventory[]> {
    return this.sculptureInventoriesRepository.findAll<SculptureInventory>();
  }

  async findAllNotApproved(): Promise<SculptureInventory[]> {
    return this.sculptureInventoriesRepository.findAll<SculptureInventory>({
      where: {
        approvalDate: null,
      },
      include: [
        {
          model: Sculpture,
          include: [
            {
              model: QPart,
              include: [
                { model: PartMold, include: [Part] },
                PartStatus,
                Image,
                Color,
              ],
            },
            User,
            {
              model: Image,
              include: [{ model: User, as: 'uploader' }],
            },
          ],
        },
      ],
    });
  }

  async findAllBySculptureId(
    sculptureId: number,
  ): Promise<SculptureInventory[]> {
    const result = await this.sculptureInventoriesRepository.findAll({
      where: {
        sculptureId,
        approvalDate: null,
      },
    });

    return result;
  }
}
