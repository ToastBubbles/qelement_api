import { Injectable, Inject } from '@nestjs/common';
import { QPart } from '../models/qPart.entity';
import { log } from 'console';
import { Op } from 'sequelize';

@Injectable()
export class QPartsService {
  constructor(
    @Inject('QPART_REPOSITORY')
    private qPartsRepository: typeof QPart,
  ) {}

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
      where: {
        approvalDate: null,
      },
    });
  }
  async findRecent(limit: number): Promise<QPart[]> {
    console.log('recent');

    return this.qPartsRepository.findAll<QPart>({
      limit,
      order: [['createdAt', 'DESC']],

      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }

  async findById(id: number): Promise<QPart | null> {
    const result = await this.qPartsRepository.findOne({
      where: {
        id: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    // if (result) {
    return result;
    // }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    // throw new HttpException('Color not found', 404);
  }

  async findMatchesById(partId: number): Promise<QPart[] | null> {
    const results = await this.qPartsRepository.findAll({
      where: {
        partId: partId,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    // if (result) {
    return results;
    // }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    // throw new HttpException('Color not found', 404);
  }
}
