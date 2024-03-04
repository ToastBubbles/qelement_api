import { Injectable, Inject } from '@nestjs/common';
import { QPart } from '../models/qPart.entity';
import { Op, literal } from 'sequelize';
import { Part } from 'src/models/part.entity';
import { PartMold } from 'src/models/partMold.entity';
import { Color } from 'src/models/color.entity';
import { User } from 'src/models/user.entity';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { PartStatus } from 'src/models/partStatus.entity';
import { Cron } from '@nestjs/schedule';
import { Comment } from 'src/models/comment.entity';
import { Image } from 'src/models/image.entity';
import { IQPartVerifcation } from 'src/interfaces/general';
import { ElementID } from 'src/models/elementID.entity';
import sequelize from 'sequelize';
import { Sculpture } from 'src/models/sculpture.entity';
import { Category } from 'src/models/category.entity';

@Injectable()
export class QPartsService {
  constructor(
    @Inject('QPART_REPOSITORY')
    private qPartsRepository: typeof QPart,
  ) {}

  // @Cron('45 * * * * *')
  // async handleCron() {
  //   //  test = await this.getRandom()
  // }

  async findAll(): Promise<QPart[]> {
    return this.qPartsRepository.findAll<QPart>({
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }

  async findAllNotApproved(): Promise<QPart[]> {
    return this.qPartsRepository.findAll<QPart>({
      include: [
        {
          model: ElementID,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
      ],
      where: {
        approvalDate: null,
      },
    });
  }
  async findRecent(limit: number): Promise<QPart[]> {
    return this.qPartsRepository.findAll<QPart>({
      include: [
        {
          model: ElementID,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        {
          model: PartStatus,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
      ],
      limit,
      order: [['createdAt', 'DESC']],
      where: {
        [Op.and]: [
          {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          sequelize.literal(
            `(SELECT COUNT(*) FROM "PartStatuses" WHERE "QPart"."id" = "PartStatuses"."qpartId" AND "PartStatuses"."status" = 'known') = 0`,
          ),
        ],
      },
    });
  }
  async findIfExists(data: IQPartVerifcation): Promise<QPart | null> {
    const result = await this.qPartsRepository.findOne({
      where: {
        moldId: data.moldId,
        colorId: data.colorId,
      },
    });
    return result;
  }

  async findPartsBySearch(search: string): Promise<QPart[] | null> {
    const searchTerm = search.replace(/\s/g, '');
    const result = await this.qPartsRepository.findAll({
      include: [
        {
          model: ElementID,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        {
          model: PartStatus,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
      ],
      where: {
        [Op.or]: [
          // { name: { [Op.iLike]: `%${search}%` } },
          literal(`REPLACE("elementId", ' ', '') ILIKE '%${searchTerm}%'`),

          // { '$PartMold.number$': { [Op.iLike]: `%${search}%` } },
        ],
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });

    return result;
  }

  async findMatchesByColorId(colorId: number): Promise<QPart[] | null> {
    const result = await this.qPartsRepository.findAll({
      include: [
        {
          model: ElementID,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        {
          model: PartStatus,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
      ],
      where: {
        colorId: colorId,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    return result;
  }

  async findById(id: number): Promise<QPart | null> {
    const result = await this.qPartsRepository.findOne({
      include: [
        {
          model: ElementID,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        {
          model: PartStatus,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },

        // {
        //   model: Image,
        //   as: 'images',
        //   where: {
        //     approvalDate: {
        //       [Op.ne]: null,
        //     },
        //   },
        // },
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
        // {
        //   model: Image,
        //   where: {
        //     approvalDate: {
        //       [Op.ne]: null,
        //     },
        //   },
        // },
      ],
      where: {
        id: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    return result;
  }

  async findByIdAll(id: number): Promise<QPart | null> {
    const result = await this.qPartsRepository.findOne({
      where: {
        id: id,
      },
    });

    return result;
  }
  async findByIdAllKnown(): Promise<QPart[] | null> {
    const result = await this.qPartsRepository.findAll({
      where: sequelize.literal(
        `(SELECT COUNT(*) FROM "PartStatuses" WHERE "QPart"."id" = "PartStatuses"."qpartId" AND "PartStatuses"."status" = 'known') > 0`,
      ),
    });

    return result;
  }

  async findByIdAllNotKnown(): Promise<QPart[] | null> {
    const result = await this.qPartsRepository.findAll({
      where: sequelize.literal(
        `(SELECT COUNT(*) FROM "PartStatuses" WHERE "QPart"."id" = "PartStatuses"."qpartId" AND "PartStatuses"."status" = 'known') = 0`,
      ),
    });

    return result;
  }
  async findMatchesByPartId(partId: number): Promise<QPart[] | null> {
    const results = await this.qPartsRepository.findAll({
      include: [
        {
          model: ElementID,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        {
          model: PartMold,
          include: [
            {
              model: Part,
              include: [
                Category,
                {
                  model: Comment,
                  include: [{ model: User, as: 'creator' }],
                },
              ],
              required: true,
              duplicating: false,
            },
          ],
          required: true,
          duplicating: false,
        },
        {
          model: Sculpture,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
          include: [
            {
              model: Image,
              where: {
                approvalDate: {
                  [Op.ne]: null,
                },
              },
              required: false,
            },
          ],
        },
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },

        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        {
          model: PartStatus,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        // {
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
        // required: true,
        // where: {
        //   approvalDate: {
        //     [Op.ne]: null,
        //   },
        // },
        // },
      ],
      where: {
        '$mold.parentPart.id$': partId,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    // console.log(results);

    return results;
  }

  async getRandom(): Promise<QPart> {
    const results = await this.qPartsRepository.findAll({
      include: [
        {
          model: ElementID,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        {
          model: PartStatus,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
        // {
        //   model: Image,
        //   where: {
        //     approvalDate: {
        //       [Op.ne]: null,
        //     },
        //   },
        // },
      ],
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    return results[Math.floor(Math.random() * results.length)];
  }
}
