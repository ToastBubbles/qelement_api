import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Image } from '../models/image.entity';
import { Op } from 'sequelize';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('IMAGE_REPOSITORY')
    private imagesRepository: typeof Image,
  ) {}

  async findAll(): Promise<Image[]> {
    return this.imagesRepository.findAll<Image>({
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }
  async findAllNotApproved(): Promise<Image[]> {
    return this.imagesRepository.findAll<Image>({
      where: {
        approvalDate: null,
      },
    });
  }
  async findAllById(id: number): Promise<Image[]> {
    return this.imagesRepository.findAll<Image>({
      where: {
        qpartId: id,
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }

  async findById(id: number): Promise<Image> {
    const result = await this.imagesRepository.findOne({
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
    throw new HttpException('not found', 404);
  }

  async findByIdAll(id: number): Promise<Image> {
    const result = await this.imagesRepository.findOne({
      where: {
        id: id,

      },
    });
    if (result) {
      return result;
    }
    // return { message: 'No color found with the TLG id.' } as IQelementError;
    throw new HttpException('not found', 404);
  }
}
