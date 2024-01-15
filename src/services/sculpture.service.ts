import { Injectable, Inject } from '@nestjs/common';
import { Sculpture } from '../models/sculpture.entity';
import { Sequelize, where } from 'sequelize';
import { QPart } from 'src/models/qPart.entity';
import { Part } from 'src/models/part.entity';
import { PartMold } from 'src/models/partMold.entity';
import { PartStatus } from 'src/models/partStatus.entity';
import { Image } from 'src/models/image.entity';
import { Color } from 'src/models/color.entity';
import { Comment } from 'src/models/comment.entity';
import { User } from 'src/models/user.entity';
import sequelize from 'sequelize';
import { Op } from 'sequelize';
import { SculptureInventory } from 'src/models/sculptureInventory.entity';

@Injectable()
export class SculpturesService {
  constructor(
    @Inject('SCULPTURE_REPOSITORY')
    private sculpturesRepository: typeof Sculpture,
  ) {}

  async findAll(): Promise<Sculpture[]> {
    return this.sculpturesRepository.findAll<Sculpture>();
  }
  async findById(
    id: number,
    includePending: boolean,
  ): Promise<Sculpture | null> {
    const throughCondition = includePending
      ? {}
      : {
          attributes: ['approvalDate'],
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
        };
    return this.sculpturesRepository.findOne<Sculpture>({
      where: { id: id },
      include: [
        {
          model: QPart,
          as: 'inventory',
          through: throughCondition,
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
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
    });
    // return this.sculpturesRepository.findOne<Sculpture>({
    //   where: { id: id },
    //   include: [
    //     {
    //       model: QPart,
    //       as: 'inventory',
    //       include: [
    //         { model: PartMold, include: [Part] },
    //         PartStatus,
    //         Image,
    //         Color,
    //       ],
    //       // where: { isApproved: true },
    //       required: false,
    //     },
    //     User,
    //     {
    //       model: Image,
    //       include: [{ model: User, as: 'uploader' }],
    //     },
    //     {
    //       model: Comment,
    //       include: [{ model: User, as: 'creator' }],
    //     },
    //   ],
    // });
  }

  async findSculpsBySearch(search: string): Promise<Sculpture[] | null> {
    const searchTerm = search.replace(/\s/g, '');
    const result = await this.sculpturesRepository.findAll({
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
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
      where: {
        // [Op.or]: [
        name: { [Op.iLike]: `%${search}%` },
        // literal(`REPLACE("elementId", ' ', '') ILIKE '%${searchTerm}%'`),

        // { '$PartMold.number$': { [Op.iLike]: `%${search}%` } },
        // ],
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });

    return result;
  }

  async findRecent(limit: number): Promise<Sculpture[]> {
    return this.sculpturesRepository.findAll<Sculpture>({
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
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
      limit,
      order: [['createdAt', 'DESC']],
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }

  async findAllNotApproved(): Promise<Sculpture[]> {
    return this.sculpturesRepository.findAll<Sculpture>({
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
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
      where: {
        approvalDate: null,
      },
    });
  }

  async findAllWithNotApprovedInventory(): Promise<Sculpture[]> {
    return this.sculpturesRepository.findAll<Sculpture>({
      include: [
        {
          model: QPart,
          as: 'inventory',
          through: {
            attributes: ['approvalDate'],
            where: {
              approvalDate: null,
            },
          },
          include: [
            { model: PartMold, include: [Part] },
            PartStatus,
            Image,
            Color,
          ],
          required: true,
        },
        User,
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
      // where: Sequelize.literal(
      //   '"inventory->SculptureInventory"."approvalDate" IS NULL',
      // ),
      // {
      //   '$inventory.SculptureInventory.approvalDate$': {
      //     [Op.or]: {
      //       [Op.is]: null,
      //       [Op.eq]: Sequelize.literal(
      //         '"inventory->SculptureInventory"."approvalDate"',
      //       ),
      //     },
      //   },
      // },
    });
  }

 

  async findByIdAll(id: number): Promise<Sculpture | null> {
    const result = await this.sculpturesRepository.findOne({
      where: {
        id: id,
      },
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
        {
          model: Comment,
          include: [{ model: User, as: 'creator' }],
        },
      ],
    });

    return result;
  }
}
