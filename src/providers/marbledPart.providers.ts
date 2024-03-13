import { MarbledPart } from 'src/models/marbledPart.entity';

export const marbledPartsProviders = [
  {
    provide: 'MARBLEDPART_REPOSITORY',
    useValue: MarbledPart,
  },
];
