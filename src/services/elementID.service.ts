import { Injectable, Inject } from '@nestjs/common';
import { ElementID } from '../models/elementID.entity';
import { QPart } from 'src/models/qPart.entity';
import { Color } from 'src/models/color.entity';
import { Image } from 'src/models/image.entity';
import { PartMold } from 'src/models/partMold.entity';
import { Part } from 'src/models/part.entity';
import { Op, literal } from 'sequelize';
import { PartStatus } from 'src/models/partStatus.entity';

@Injectable()
export class ElementIDsService {
  constructor(
    @Inject('ELEMENTID_REPOSITORY')
    private elementIDsRepository: typeof ElementID,
  ) {}

  async findAll(): Promise<ElementID[]> {
    return this.elementIDsRepository.findAll<ElementID>();
  }

  async findPartsBySearch(search: string): Promise<ElementID[] | null> {
    const searchTerm = Number(search.replace(/\s/g, ''));
    if (searchTerm) {
      const result = await this.elementIDsRepository.findAll({
        include: [
          {
            model: QPart,
            include: [
              Color,
              Image,
              { model: PartMold, include: [Part] },
              PartStatus,
            ],
          },
        ],
        where: {
          number: searchTerm,
          // [Op.or]: [
          //   // { name: { [Op.iLike]: `%${search}%` } },
          //   literal(`REPLACE("number", ' ', '') ILIKE '%${searchTerm}%'`),

          //   // { '$PartMold.number$': { [Op.iLike]: `%${search}%` } },
          // ],

          // approvalDate: {
          //   [Op.ne]: null,
          // },
        },
      });

      return result;
    }
    return null;
  }
}
