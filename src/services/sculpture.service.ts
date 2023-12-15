import { Injectable, Inject } from '@nestjs/common';
import { Sculpture } from '../models/sculpture.entity';
import { where } from 'sequelize';

@Injectable()
export class SculpturesService {
  constructor(
    @Inject('SCULPTURE_REPOSITORY')
    private sculpturesRepository: typeof Sculpture,
  ) {}

  async findAll(): Promise<Sculpture[]> {
    return this.sculpturesRepository.findAll<Sculpture>();
  }
  async findOneById(id: number): Promise<Sculpture | null> {
    return this.sculpturesRepository.findOne<Sculpture>({ where: { id: id } });
  }
}
