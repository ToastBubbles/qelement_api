import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PartsModule } from './modules/parts.module';
import { CategoriesModule } from './modules/category.module';
import { SubcategoriesModule } from './modules/subcategory.module';
import { Color } from './models/color.entity';
import { QPart } from './models/qPart.entity';
import { User } from './models/user.entity';
import { Image } from './models/image.entity';
import { RaretyRating } from './models/raretyRating.entity';
import { Message } from './models/message.entity';
import { Comment } from './models/comment.entity';
import { PriceHistory } from './models/priceHistory.entity';
import { UserFavorite } from './models/userFavorite.entity';
import { UserInventory } from './models/userInventory.entity';
import { KnownColor } from './models/knownColor.entity';
import { UserPreference } from './models/userPreference.entity';
import { Status } from './models/status.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PartsModule,
    CategoriesModule,
    SubcategoriesModule,
    Color,
    QPart,
    User,
    Image,
    RaretyRating,
    Message,
    Comment,
    PriceHistory,
    UserFavorite,
    UserInventory,
    UserPreference,
    KnownColor,
    Status,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
