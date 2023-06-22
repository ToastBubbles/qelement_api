import { Module } from '@nestjs/common';
import { CategoriesController } from '../controllers/category.controller';
import { CategoriesService } from '../services/category.service';
import { cartegoriesProviders } from '../providers/category.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, ...cartegoriesProviders],
  exports: [CategoriesService],
})
export class CategoriesModule {}
