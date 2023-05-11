import { Injectable, Inject, HttpException } from '@nestjs/common';
import { IQelementError } from 'src/interfaces/error';
import { Color } from '../models/color.entity';

@Injectable()
export class ColorsService {
  constructor(
    @Inject('COLOR_REPOSITORY')
    private colorsRepository: typeof Color,
  ) {}

  async findAll(): Promise<Color[]> {
    return this.colorsRepository.findAll<Color>();
  }

  async findByTlgId(id: number): Promise<Color | IQelementError> {
    const result = await this.colorsRepository.findOne({
      where: { tlg_id: id },
    });
    if (result) {
      return result;
    }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    throw new HttpException('Color not found', 404);
  }
  async findById(id: number): Promise<Color | IQelementError> {
    const result = await this.colorsRepository.findOne({
      where: { id: id },
    });
    if (result) {
      return result;
    }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    throw new HttpException('Color not found', 404);
  }
}
