import { Module } from '@nestjs/common';
import { SubcategoriesController } from '../controllers/subcategory.controller';
import { SubcategoryService } from '../services/subcategory.service';
import { subcategoriesProviders } from '../providers/subcategory.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SubcategoriesController],
  providers: [SubcategoryService, ...subcategoriesProviders],
})
export class SubcategoriesModule {}
