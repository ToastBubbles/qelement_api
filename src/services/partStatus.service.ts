import { Injectable, Inject, HttpException } from '@nestjs/common';
import { PartStatus } from '../models/partStatus.entity';
import { Op } from 'sequelize';
import { QPart } from 'src/models/qPart.entity';
import { Image } from 'src/models/image.entity';
import { PartMold } from 'src/models/partMold.entity';
import { Part } from 'src/models/part.entity';
import { Color } from 'src/models/color.entity';
import { User } from 'src/models/user.entity';

@Injectable()
export class PartStatusesService {
  constructor(
    @Inject('PARTSTATUS_REPOSITORY')
    private partStatusesRepository: typeof PartStatus,
  ) {}

  async findPartMoldsByQPartID(qpartId: number): Promise<PartStatus[] | null> {
    const result = await this.partStatusesRepository.findAll({
      where: {
        qpartId,
      },
    });

    return result;
  }

  async findAll(): Promise<PartStatus[]> {
    return this.partStatusesRepository.findAll<PartStatus>({
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }
  async findAllNotApproved(): Promise<PartStatus[]> {
    return this.partStatusesRepository.findAll<PartStatus>({
      where: {
        approvalDate: null,
      },
      include: [
        {
          model: QPart,

          include: [
            {
              model: PartStatus,

              required: false,
            },

            Image,
            { model: PartMold, include: [Part] },
            Color,
          ],
        },
        { model: User, as: 'creator' },
      ],
    });
  }

  async findByQPartId(qpartId: number): Promise<PartStatus[]> {
    return this.partStatusesRepository.findAll<PartStatus>({
      where: {
        qpartId: qpartId,
        approvalDate: {
          [Op.ne]: null,
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number): Promise<PartStatus> {
    const result = await this.partStatusesRepository.findOne({
      where: {
        id: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    if (result) {
      return result;
    }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    throw new HttpException('Cat not found', 404);
  }

  async findByIdAll(id: number): Promise<PartStatus | null> {
    const result = await this.partStatusesRepository.findOne({
      where: {
        id: id,
      },
    });

    return result;

    // return { message: 'No color found with the TLG id.' } as IQelementError;
    // throw new HttpException('Cat not found', 404);
  }
}
