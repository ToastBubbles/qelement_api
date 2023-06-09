import { Injectable, Inject } from '@nestjs/common';
import { IRatingDTO } from 'src/interfaces/general';
import { RaretyRating } from '../models/raretyRating.entity';
import { QPart } from 'src/models/qPart.entity';

export interface IRaretyObject {
  id: number;
  rarety: number;
}
@Injectable()
export class RaretyRatingsService {
  constructor(
    @Inject('RARETYRATING_REPOSITORY')
    private raretyRatingsRepository: typeof RaretyRating,
  ) {}

  async findAll(): Promise<RaretyRating[]> {
    return this.raretyRatingsRepository.findAll<RaretyRating>();
  }

  async findByUserAndQPartId(
    userId: number,
    qpartId: number,
  ): Promise<RaretyRating | null> {
    const result = await this.raretyRatingsRepository.findOne({
      where: { creatorId: userId, qpartId: qpartId },
    });
    if (result) {
      return result;
    }
    return null;
  }
  // export interface IRatingDTO {
  //   // id: number;
  //   rating: number;
  //   qpartId: number;
  //   creatorId: number;
  // }
  async addRating({ rating, qpartId, creatorId }: IRatingDTO) {
    try {
      console.log(creatorId);

      if (rating >= 0 && rating <= 100) {
        rating = Math.round(rating);
        let newRating = new RaretyRating({
          rating,
          qpartId,
          creatorId,
        });
        console.log(newRating);

        const checkIfExists = await this.raretyRatingsRepository.findOne({
          where: { creatorId: creatorId, qpartId: qpartId },
        });
        if (checkIfExists) {
          checkIfExists.rating = rating;
          checkIfExists.save();
        } else {
          newRating.save();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getRatings(qpartId: number): Promise<RaretyRating[]> {
    const results = await this.raretyRatingsRepository.findAll({
      where: {
        qpartId: qpartId,
      },
    });
    return results;
  }
  async getRatingTotal(qpartId: number): Promise<number> {
    const results = await this.raretyRatingsRepository.findAll({
      where: {
        qpartId: qpartId,
      },
    });

    if (results.length == 0) {
      return -1;
    } else {
      let count = 0;
      let total = 0;
      for (let rating of results) {
        total += rating.rating;
        count++;
      }
      return Math.round(total / count);
    }
  }
  async getRatingTotals(qpartId: number): Promise<IRaretyObject> {
    const results = await this.raretyRatingsRepository.findAll({
      where: {
        qpartId: qpartId,
      },
    });

    if (results.length == 0) {
      return { id: qpartId, rarety: -1 };
    } else {
      let count = 0;
      let total = 0;
      for (let rating of results) {
        total += rating.rating;
        count++;
      }
      return { id: qpartId, rarety: Math.round(total / count) };
    }
  }
}
