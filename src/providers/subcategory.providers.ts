import { Subcategory } from '../models/subcategory.entity';

export const subcategoriesProviders = [
  {
    provide: 'SUBCATEGORY_REPOSITORY',
    useValue: Subcategory,
  },
];
