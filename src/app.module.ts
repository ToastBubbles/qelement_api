import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { SculptureModule } from './modules/sculpture.module';
import { AdminMiddleware } from './auth/admin.middleware';
import { CategoriesController } from './controllers/category.controller';
import { ColorsController } from './controllers/color.controller';
import { ElementIDsController } from './controllers/elementID.controller';
import { CommentsController } from './controllers/comment.controller';


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
  ],
  controllers: [AppController, EverythingController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AdminMiddleware).forRoutes(CategoriesController);
    //admin MW
    consumer
      .apply(AdminMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'categories/add', method: RequestMethod.POST },
        { path: 'categories', method: RequestMethod.GET },
        { path: 'categories/(.*)', method: RequestMethod.GET },
        { path: 'color/add', method: RequestMethod.POST },
        { path: 'color', method: RequestMethod.GET },
        { path: 'color/(.*)', method: RequestMethod.GET },
        { path: 'elementID/add', method: RequestMethod.POST },
        { path: 'elementID', method: RequestMethod.GET },
        { path: 'elementID/(.*)', method: RequestMethod.GET },
        { path: 'image/upload', method: RequestMethod.POST },
        { path: 'image', method: RequestMethod.GET },
        { path: 'image/(.*)', method: RequestMethod.GET },
        { path: 'comment', method: RequestMethod.ALL },
        { path: 'comment/(.*)', method: RequestMethod.ALL },
        { path: 'message', method: RequestMethod.ALL },
        { path: 'message/(.*)', method: RequestMethod.ALL },
        { path: 'partMold', method: RequestMethod.GET },
        { path: 'partMold/(.*)', method: RequestMethod.GET },
        { path: 'parts/add', method: RequestMethod.POST },
        { path: 'parts', method: RequestMethod.GET },
        { path: 'parts/(.*)', method: RequestMethod.GET },
        { path: 'partStatus/add', method: RequestMethod.POST },
        { path: 'partStatus/mass', method: RequestMethod.POST },
        { path: 'partStatus', method: RequestMethod.GET },
        { path: 'partStatus/(.*)', method: RequestMethod.GET },
        { path: 'predefinedSecurityQuestion', method: RequestMethod.GET },
        { path: 'predefinedSecurityQuestion/(.*)', method: RequestMethod.GET },
        { path: 'qpart/add', method: RequestMethod.POST },
        { path: 'qpart/mass', method: RequestMethod.POST },
        { path: 'qpart', method: RequestMethod.GET },
        { path: 'qpart/(.*)', method: RequestMethod.GET },
        { path: 'rating', method: RequestMethod.ALL },
        { path: 'rating/(.*)', method: RequestMethod.ALL },
        { path: 'sculpture/add', method: RequestMethod.POST },
        { path: 'sculpture', method: RequestMethod.GET },
        { path: 'sculpture/(.*)', method: RequestMethod.GET },
        {
          path: 'sculptureInventory/addParts/(.*)',
          method: RequestMethod.POST,
        },
        { path: 'sculptureInventory', method: RequestMethod.GET },
        { path: 'sculptureInventory/(.*)', method: RequestMethod.GET },
        { path: 'securityQuestion', method: RequestMethod.ALL },
        { path: 'securityQuestion/(.*)', method: RequestMethod.ALL },
        { path: 'similarColor/add', method: RequestMethod.POST },
        { path: 'similarColor', method: RequestMethod.GET },
        { path: 'similarColor/(.*)', method: RequestMethod.GET },
        { path: 'title', method: RequestMethod.GET },
        { path: 'title/(.*)', method: RequestMethod.GET },
        { path: 'user/register', method: RequestMethod.POST },
        { path: 'user/recover', method: RequestMethod.POST },
        { path: 'user', method: RequestMethod.GET },
        { path: 'user/(.*)', method: RequestMethod.GET },
        { path: 'userFavorite', method: RequestMethod.ALL },
        { path: 'userFavorite/(.*)', method: RequestMethod.ALL },
        { path: 'userGoal', method: RequestMethod.ALL },
        { path: 'userGoal/(.*)', method: RequestMethod.ALL },
        { path: 'userInventory', method: RequestMethod.ALL },
        { path: 'userInventory/(.*)', method: RequestMethod.ALL },
        { path: 'userPreference', method: RequestMethod.ALL },
        { path: 'userPreference/(.*)', method: RequestMethod.ALL },
        { path: 'userTitle', method: RequestMethod.ALL },
        { path: 'userTitle/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // consumer
    //   .apply(AdminMiddleware)
    //   .forRoutes(
    //     { path: 'categories/apporve', method: RequestMethod.POST },
    //   );
  }
}
