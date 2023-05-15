import { Injectable, Inject } from '@nestjs/common';
import { Part } from '../models/part.entity';

@Injectable()
export class PartsService {
  constructor(
    @Inject('PART_REPOSITORY')
    private partsRepository: typeof Part,
  ) {}
  async findById(id: number): Promise<Part | null> {
    const result = await this.partsRepository.findOne({
      where: { id: id },
    });

    return result;
  }
  async findAll(): Promise<Part[]> {
    return this.partsRepository.findAll<Part>();
  }
}
