import { Injectable, Inject, HttpException } from '@nestjs/common';
import { IQelementError } from 'src/interfaces/error';
import { Color } from '../models/color.entity';
import { NotNull } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { User } from 'src/models/user.entity';

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
      include: [
        {
          model: Color,
          as: 'similar',
          through: {
            attributes: ['approvalDate', 'id'],
            where: {
              approvalDate: { [Op.ne]: null },
            },
          },
          required: false,
        },
      ],
    });
  }
  async findAllNotApproved(): Promise<Color[]> {
    return this.colorsRepository.findAll<Color>({
      where: {
        approvalDate: null,
      },
      include: [{ model: User, as: 'creator' }],
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
      include: [
        {
          model: Color,
          as: 'similar',

          // where: { approvalDate: { [Op.ne]: null } },
          through: {
            attributes: ['approvalDate', 'id'],
            where: {
              approvalDate: { [Op.ne]: null },
            },
          },
          required: false,
        },
      ],
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
