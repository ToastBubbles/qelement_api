import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PartsModule } from './modules/parts.module';
import { CategoriesModule } from './modules/category.module';
import { SubcategoriesModule } from './modules/subcategory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PartsModule,
    CategoriesModule,
    SubcategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
