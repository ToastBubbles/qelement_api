import { Injectable, Inject } from '@nestjs/common';
import { Image } from '../models/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('IMAGE_REPOSITORY')
    private imagesRepository: typeof Image,
  ) {}

  async findAll(): Promise<Image[]> {
    return this.imagesRepository.findAll<Image>();
  }
  async findAllById(id: number): Promise<Image[]> {
    return this.imagesRepository.findAll<Image>({
      where: { qpartId: id },
    });
  }
}
