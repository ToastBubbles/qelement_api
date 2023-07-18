import { Injectable, Inject } from '@nestjs/common';
import { PartMold } from '../models/partMold.entity';
import { Part } from 'src/models/part.entity';
import { Op, literal } from 'sequelize';

@Injectable()
export class PartMoldsService {
  constructor(
    @Inject('PARTMOLD_REPOSITORY')
    private partMoldsRepository: typeof PartMold,
  ) {}

  async findAll(): Promise<PartMold[]> {
    return this.partMoldsRepository.findAll<PartMold>();
  }

  async findAllNotApproved(): Promise<PartMold[]> {
    return this.partMoldsRepository.findAll<PartMold>({
      include: [Part],
      where: {
        approvalDate: null,
      },
    });
  }
  async findPartsBySearch(search: string): Promise<PartMold[] | null> {
    const result = await this.partMoldsRepository.findAll({
      include: [Part],
      where: {
        [Op.or]: [{ number: { [Op.iLike]: `%${search}%` } }],
        approvalDate: {
          [Op.ne]: null,
        },
      },
    });

    return result;
  }

  async findByIdAll(id: number): Promise<PartMold | null> {
    const result = await this.partMoldsRepository.findOne({
      where: {
        id: id,
      },
    });

    return result;
  }
}
