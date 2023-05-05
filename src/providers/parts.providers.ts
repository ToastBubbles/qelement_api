import { Part } from '../models/part.entity';

export const partsProviders = [
  {
    provide: 'PART_REPOSITORY',
    useValue: Part,
  },
];
