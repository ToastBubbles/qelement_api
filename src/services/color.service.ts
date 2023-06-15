import { Injectable, Inject, HttpException } from '@nestjs/common';
import { IQelementError } from 'src/interfaces/error';
import { Color } from '../models/color.entity';
import { NotNull } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export class ColorsService {
  constructor(
    @Inject('COLOR_REPOSITORY')
    private colorsRepository: typeof Color,
  ) {}

  async findAll(): Promise<Color[]> {
    return this.colorsRepository.findAll<Color>({
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }
  async findAllNotApproved(): Promise<Color[]> {
    return this.colorsRepository.findAll<Color>({
      where: {
        approvalDate: null,
      },
    });
  }

  async findByTlgId(id: number): Promise<Color> {
    const result = await this.colorsRepository.findOne({
      where: {
        tlg_id: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
    if (result) {
      return result;
    }
    throw new HttpException('Color not found', 404);
  }
  async findById(id: number): Promise<Color> {
    const result = await this.colorsRepository.findOne({
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
    throw new HttpException('Color not found', 404);
  }

  async findByIdAll(id: number): Promise<Color> {
    const result = await this.colorsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (result) {
      return result;
    }
    throw new HttpException('Color not found', 404);
  }
}
