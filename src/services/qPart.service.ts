import { Injectable, Inject } from '@nestjs/common';
import { QPart } from '../models/qPart.entity';
import { log } from 'console';

@Injectable()
export class QPartsService {
  constructor(
    @Inject('QPART_REPOSITORY')
    private qPartsRepository: typeof QPart,
  ) {}

  async findAll(): Promise<QPart[]> {
    return this.qPartsRepository.findAll<QPart>();
  }
  async findRecent(limit: number): Promise<QPart[]> {
    console.log('recent');

    return this.qPartsRepository.findAll<QPart>({
      limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number): Promise<QPart | null> {
    const result = await this.qPartsRepository.findOne({
      where: { id: id },
    });
    // if (result) {
    return result;
    // }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    // throw new HttpException('Color not found', 404);
  }

  async findMatchesById(partId: number): Promise<QPart[] | null> {
    const results = await this.qPartsRepository.findAll({
      where: { partId: partId },
    });
    // if (result) {
    return results;
    // }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    // throw new HttpException('Color not found', 404);
  }
}
