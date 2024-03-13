import { Injectable, Inject } from '@nestjs/common';
import { MarbledPart } from 'src/models/marbledPart.entity';

@Injectable()
export class MarbledPartsService {
  constructor(
    @Inject('MARBLEDPART_REPOSITORY')
    private marbledPartsRepository: typeof MarbledPart,
  ) {}

  async findAll(): Promise<MarbledPart[]> {
    return this.marbledPartsRepository.findAll<MarbledPart>();
  }
}
