import { Injectable, Inject } from '@nestjs/common';
import { QPart } from '../models/qPart.entity';

@Injectable()
export class QPartsService {
  constructor(
    @Inject('QPART_REPOSITORY')
    private qPartsRepository: typeof QPart,
  ) {}

  async findAll(): Promise<QPart[]> {
    return this.qPartsRepository.findAll<QPart>();
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
}
