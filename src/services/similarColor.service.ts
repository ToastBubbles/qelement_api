import { Injectable, Inject, HttpException } from '@nestjs/common';
import { where } from 'sequelize';
import { SimilarColor } from '../models/similarColor.entity';
import { Op } from 'sequelize';
import { Color } from 'src/models/color.entity';
import { User } from 'src/models/user.entity';

@Injectable()
export class SimilarColorsService {
  constructor(
    @Inject('SIMILARCOLOR_REPOSITORY')
    private similarColorsRepository: typeof SimilarColor,
  ) {}

  async findAll(): Promise<SimilarColor[]> {
    return this.similarColorsRepository.findAll<SimilarColor>({
      where: {
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });
  }

  async findAllNotApproved(): Promise<SimilarColor[]> {
    return this.similarColorsRepository.findAll<SimilarColor>({
      where: {
        approvalDate: null,
      },
      include: [
        { model: Color, as: 'color1' },
        { model: Color, as: 'color2' },
        User,
      ],
    });
  }

  async findAllSimilar(id: number): Promise<SimilarColor[]> {
    const results = await this.similarColorsRepository.findAll({
      where: {
        colorId1: id,
        approvalDate: {
          [Op.ne]: null,
        },
        // $or: [
        //   {
        //     colorId2: id,
        //   },
        // ],
      },
    });
    // console.log(results);
    // console.log(typeof results);

    return results;
    // console.log(results);

    // return this.similarColorsRepository.findAll<SimilarColor>();
  }

  async checkIfExists(
    match: SimilarColor,
    includeSoftDeleted: boolean = false,
  ): Promise<SimilarColor | null> {
    const whereCondition: any = {
      colorId1: match.colorId1,
      colorId2: match.colorId2,
    };

    const result = await this.similarColorsRepository.findOne({
      where: whereCondition,
      paranoid: !includeSoftDeleted,
    });

    return result; 
  }

  async findById(id: number): Promise<SimilarColor> {
    const result = await this.similarColorsRepository.findOne({
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
  async findByIdAll(id: number): Promise<SimilarColor> {
    const result = await this.similarColorsRepository.findOne({
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
