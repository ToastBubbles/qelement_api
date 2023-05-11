import { Injectable, Inject } from '@nestjs/common';
import { where } from 'sequelize';
import { SimilarColor } from '../models/similarColor.entity';

@Injectable()
export class SimilarColorsService {
  constructor(
    @Inject('SIMILARCOLOR_REPOSITORY')
    private similarColorsRepository: typeof SimilarColor,
  ) {}

  async findAll(): Promise<SimilarColor[]> {
    return this.similarColorsRepository.findAll<SimilarColor>();
  }

  async findAllSimilar(id: number): Promise<SimilarColor[]> {
    const results = await this.similarColorsRepository.findAll({
      where: {
        colorId1: id,
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

  async checkIfExists(match: SimilarColor): Promise<boolean> {
    //returns true  if match exists
    // console.log('got here');

    const result = await this.similarColorsRepository.findOne({
      where: { colorId1: match.colorId1, colorId2: match.colorId2 },
    });
    // console.log('result:', result);

    if (result) return true;
    return false;
  }
}
