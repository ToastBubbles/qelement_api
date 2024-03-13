
import { Injectable, Inject } from '@nestjs/common';
import { MarbledPartColor } from 'src/models/marbledPartColor.entity';

@Injectable()
export class MarbledPartColorsService {
constructor(
@Inject('MARBLEDPARTCOLOR_REPOSITORY')
private marbledPartColorsRepository: typeof MarbledPartColor,
) {}

async findAll(): Promise<MarbledPartColor[]> {
return this.marbledPartColorsRepository.findAll<MarbledPartColor>();
}
}
