import { Module } from '@nestjs/common';
import { CategoriesController } from '../controllers/category.controller';
import { CategoriesService } from '../services/category.service';
import { cartegoriesProviders } from '../providers/category.providers';
import { DatabaseModule } from './database.module';
import { UserModule } from './user.module';
import { AdminMiddleware } from 'src/auth/admin.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [CategoriesController],
  providers: [
    AdminMiddleware,
    CategoriesService,
    JwtService,
    ...cartegoriesProviders,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
