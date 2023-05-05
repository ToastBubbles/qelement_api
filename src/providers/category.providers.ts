import { Category } from '../models/category.entity';

export const cartegoriesProviders = [
  {
    provide: 'CATEGORY_REPOSITORY',
    useValue: Category,
  },
];
