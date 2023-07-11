import { Injectable, Inject } from '@nestjs/common';
import { UserInventory } from '../models/userInventory.entity';
import { QPart } from 'src/models/qPart.entity';
import { PartMold } from 'src/models/partMold.entity';
import { Color } from 'src/models/color.entity';
import { Part } from 'src/models/part.entity';
import { User } from 'src/models/user.entity';
import { Image } from 'src/models/image.entity';

@Injectable()
export class UserInventoriesService {
  constructor(
    @Inject('USERINVENTORY_REPOSITORY')
    private userInventoriesRepository: typeof UserInventory,
  ) {}

  async findAllByUserId(userId: number): Promise<UserInventory[]> {
    return this.userInventoriesRepository.findAll<UserInventory>({
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
          ],
          required: true,
          duplicating: false,
        },
      ],
      where: { userId: userId },
    });
  }

  async findAll(): Promise<UserInventory[]> {
    return this.userInventoriesRepository.findAll<UserInventory>();
  }

  //   async getQPartsInUserInventory(userId: number): Promise<QPart[]> {
  //     const user = await User.findByPk(userId);

  //     if (!user) {
  //       throw new Error(`User with ID ${userId} not found.`);
  //     }

  //     const qParts = (await user.$get('inventory')) as QPart[];
  //     console.log(qParts);

  //     return qParts;
  //   }
}
