import { Category } from './models/category.entity';

export class TestService {
  dbTest(): string {
    const category = Category.build({ name: 'Brick' });
    category.save();

    return 'this is for tesiting';
  }
}
