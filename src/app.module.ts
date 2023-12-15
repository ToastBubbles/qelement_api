import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PartsModule } from './modules/parts.module';
import { CategoriesModule } from './modules/category.module';
import { ColorModule } from './modules/color.module';
import { QPartModule } from './modules/qPart.module';
import { UserModule } from './modules/user.module';
import { ImageModule } from './modules/image.module';
import { RaretyRatingModule } from './modules/raretyRating.module';
import { PartStatusModule } from './modules/partStatus.module';
import { MessageModule } from './modules/message.module';
import { CommentModule } from './modules/comment.module';
import { UserFavoriteModule } from './modules/userFavorite.module';
import { UserInventoryModule } from './modules/userInventory.module';
import { UserPreferenceModule } from './modules/userPreference.module';
import { EverythingController } from './controllers/everything.controller';
import { SimilarColorModule } from './modules/similarColor.module';
import { AuthModule } from './auth/auth.module';
import { TitleModule } from './modules/title.module';
import { UserTitleModule } from './modules/userTitle.module';
import { PartMoldModule } from './modules/partMold.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { UserGoalModule } from './modules/userGoal.module';
import { ElementIDModule } from './modules/elementID.module';
import { SecurityQuestionModule } from './modules/securityQuestion.module';
import { PredefinedSecurityQuestionModule } from './modules/predefinedSecurityQuestion.module';
import { SculptureInventoryModule } from './modules/sculptureInventory.module';
import { SculptureColorModule } from './modules/sculptureColor.module';
import { SculptureModule } from './modules/sculpture.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    CacheModule.register(),
    PartsModule,
    CategoriesModule,
    ColorModule,
    QPartModule,
    UserModule,
    ImageModule,
    RaretyRatingModule,
    PartStatusModule,
    MessageModule,
    CommentModule,
    UserFavoriteModule,
    UserInventoryModule,
    UserPreferenceModule,
    SimilarColorModule,
    AuthModule,
    TitleModule,
    UserTitleModule,
    PartMoldModule,
    UserGoalModule,
    ElementIDModule,
    SecurityQuestionModule,
    PredefinedSecurityQuestionModule,
    SculptureModule,
    SculptureInventoryModule,
    SculptureColorModule,
  ],
  controllers: [AppController, EverythingController],
  providers: [AppService],
})
export class AppModule {}
