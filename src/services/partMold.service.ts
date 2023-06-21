import { Injectable, Inject } from '@nestjs/common';
import { PartMold } from '../models/partMold.entity';
import { Part } from 'src/models/part.entity';

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

  async findByIdAll(id: number): Promise<PartMold | null> {
    const result = await this.partMoldsRepository.findOne({
      where: {
        id: id,
      },
    });

    return result;
  }
}
