import { Injectable, Inject, HttpException } from '@nestjs/common';
import { PartStatus } from '../models/partStatus.entity';
import { Op } from 'sequelize';

@Injectable()
export class PartStatusesService {
  constructor(
    @Inject('PARTSTATUS_REPOSITORY')
    private partStatusesRepository: typeof PartStatus,
  ) {}

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

  async findByIdAll(id: number): Promise<PartStatus> {
    const result = await this.partStatusesRepository.findOne({
      where: {
        id: id,
      },
    });
    if (result) {
      return result;
    }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    throw new HttpException('Cat not found', 404);
  }
}
