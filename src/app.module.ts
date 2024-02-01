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
import { TrustedMiddleware } from './auth/trusted.middleware';
import { UserMiddleware } from './auth/user.middleware';
import { LoggerMiddleware } from './auth/logger.middleware';

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
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(AdminMiddleware)
      .forRoutes(
        { path: 'extra/addAllColors', method: RequestMethod.GET },
        { path: 'user/suspend', method: RequestMethod.POST },
        { path: 'user/newRole', method: RequestMethod.POST },
      );

    consumer.apply(TrustedMiddleware).forRoutes(
      { path: 'categories/approve', method: RequestMethod.POST },
      { path: 'categories/deny', method: RequestMethod.POST },
      { path: 'categories/edit', method: RequestMethod.POST },
      { path: 'color/approve', method: RequestMethod.POST },
      { path: 'color/deny', method: RequestMethod.POST },
      { path: 'color/edit/:id', method: RequestMethod.POST },
      { path: 'elementID/approve', method: RequestMethod.POST },
      { path: 'elementID/deny', method: RequestMethod.POST },
      { path: 'extra/getNotApprovedCounts', method: RequestMethod.GET },
      { path: 'image/markPrimary', method: RequestMethod.POST },
      { path: 'image/approve', method: RequestMethod.POST },
      { path: 'image/deny', method: RequestMethod.POST },
      { path: 'partMold/approve', method: RequestMethod.POST },
      { path: 'partMold/deny', method: RequestMethod.POST },
      { path: 'parts/approve', method: RequestMethod.POST },
      { path: 'parts/deny', method: RequestMethod.POST },
      { path: 'partStatus/approve', method: RequestMethod.POST },
      { path: 'partStatus/deny', method: RequestMethod.POST },
      { path: 'qPart/approve', method: RequestMethod.POST },
      { path: 'qPart/deny', method: RequestMethod.POST },
      { path: 'sculpture/approve', method: RequestMethod.POST },
      { path: 'sculpture/deny', method: RequestMethod.POST },
      {
        path: 'sculptureInventory/approveInventory',
        method: RequestMethod.POST,
      },
      {
        path: 'sculptureInventory/denyInventory',
        method: RequestMethod.POST,
      },
      { path: 'similarColor/approve', method: RequestMethod.POST },
      { path: 'similarColor/deny', method: RequestMethod.POST },
    );

    consumer.apply(UserMiddleware).forRoutes(
      { path: 'auth/profile', method: RequestMethod.GET },
      { path: 'categories/add', method: RequestMethod.POST },
      { path: 'color/add', method: RequestMethod.POST },
      { path: 'comment/add', method: RequestMethod.POST },
      { path: 'comment/remove', method: RequestMethod.POST },
      { path: 'elementID/add', method: RequestMethod.POST },
      { path: 'image/upload', method: RequestMethod.POST },
      { path: 'message/getOneById/:id', method: RequestMethod.GET },
      { path: 'message/getAllById/:id', method: RequestMethod.GET },
      { path: 'message/getUnreadCountById/:id', method: RequestMethod.GET },
      { path: 'message/send', method: RequestMethod.POST },
      { path: 'message/delete/:id', method: RequestMethod.POST },
      { path: 'message/read/:id', method: RequestMethod.POST },
      { path: 'parts/add', method: RequestMethod.POST },
      { path: 'partStatus/add', method: RequestMethod.POST },
      { path: 'partStatus/mass', method: RequestMethod.POST },
      { path: 'qPart/add', method: RequestMethod.POST },
      { path: 'qPart/mass', method: RequestMethod.POST },
      { path: 'rating/getMyRating/:qpartId', method: RequestMethod.GET },
      { path: 'rating/addRating', method: RequestMethod.POST },
      {
        path: 'sculpture/byIdWithPendingParts/:id',
        method: RequestMethod.GET,
      },
      { path: 'sculpture/add', method: RequestMethod.POST },
      { path: 'sculptureInventory/addParts/:id', method: RequestMethod.POST },
      { path: 'similarColor/add', method: RequestMethod.POST },
      { path: 'user/getQuestions/:email', method: RequestMethod.GET },
      { path: 'user/checkIfAdmin/:userid', method: RequestMethod.GET },
      { path: 'user/favoriteColor', method: RequestMethod.POST },
      { path: 'userFavorite/id/:userid', method: RequestMethod.GET },
      { path: 'userFavorite/add', method: RequestMethod.POST },
      { path: 'userFavorite/remove', method: RequestMethod.POST },
      { path: 'userGoal/id/:userid', method: RequestMethod.GET },
      { path: 'userGoal/add', method: RequestMethod.POST },
      { path: 'userInventory/id/:userid', method: RequestMethod.GET },
      { path: 'userInventory/add', method: RequestMethod.POST },
      { path: 'userPreference/userId/:userId', method: RequestMethod.POST },
    );
  }

  // unprotected routes: (
  // { path: 'auth/login', method: RequestMethod.POST },
  // { path: 'categories', method: RequestMethod.GET },
  // { path: 'categories/id/:id', method: RequestMethod.GET },
  // { path: 'color', method: RequestMethod.GET },
  // { path: 'color/id/:id', method: RequestMethod.GET },
  // { path: 'comment', method: RequestMethod.GET },
  // { path: 'elementID', method: RequestMethod.GET },
  // { path: 'elementID/search', method: RequestMethod.GET },
  // { path: 'image', method: RequestMethod.GET },
  // { path: 'image/name/:fileName', method: RequestMethod.GET },
  // { path: 'image/id/:id', method: RequestMethod.GET },
  // { path: 'partMold', method: RequestMethod.GET },
  // { path: 'partMold/search', method: RequestMethod.GET },
  // { path: 'partMold/number', method: RequestMethod.GET },
  // { path: 'part', method: RequestMethod.GET },
  // { path: 'part/byCatId/:id', method: RequestMethod.GET },
  // { path: 'part/search', method: RequestMethod.GET },
  // { path: 'part/byNumber/:num', method: RequestMethod.GET },
  // { path: 'part/id/:id', method: RequestMethod.GET },
  // { path: 'part/childrenById/:id', method: RequestMethod.GET },
  // { path: 'partStatus', method: RequestMethod.GET },
  // { path: 'partStatus/byQPartId/:qpartId', method: RequestMethod.GET },
  // { path: 'predefinedSecurityQuestion', method: RequestMethod.GET },
  // { path: 'qPart', method: RequestMethod.GET },
  // { path: 'qPart/search', method: RequestMethod.GET },
  // { path: 'qPart/recent/:limit', method: RequestMethod.GET },
  // { path: 'qPart/id/:id', method: RequestMethod.GET },
  // { path: 'qPart/colorMatches/:colorId', method: RequestMethod.GET },
  // { path: 'qPart/qpotd', method: RequestMethod.GET },
  // { path: 'qPart/getDetails/:id', method: RequestMethod.GET },
  // { path: 'qPart/matchesByPartId/:id', method: RequestMethod.GET },
  // { path: 'qPart/checkIfExists', method: RequestMethod.GET },
  // { path: 'rating', method: RequestMethod.GET },
  // { path: 'securityQuestion/check', method: RequestMethod.POST },
  // { path: 'sculpture', method: RequestMethod.GET },
  // { path: 'sculpture/byId/:id', method: RequestMethod.GET },
  // { path: 'sculpture/recent/:limit', method: RequestMethod.GET },
  // { path: 'sculpture/search', method: RequestMethod.GET },
  // { path: 'sculptureInventory', method: RequestMethod.GET },
  // { path: 'securityQuestion', method: RequestMethod.GET },
  // { path: 'similarColor', method: RequestMethod.GET },
  // { path: 'similarColor/id/:id', method: RequestMethod.GET },
  // { path: 'title', method: RequestMethod.GET },
  // { path: 'user', method: RequestMethod.GET },
  // { path: 'user/checkInsensitive/:username', method: RequestMethod.GET },
  // { path: 'user/username/:username', method: RequestMethod.GET },
  // { path: 'user/id/:userid', method: RequestMethod.GET },
  // { path: 'user/register', method: RequestMethod.POST },
  // { path: 'categories/notApproved', method: RequestMethod.GET },
  // { path: 'color/notApproved', method: RequestMethod.GET },
  // { path: 'elementID/notApproved', method: RequestMethod.GET },
  // { path: 'image/notApproved', method: RequestMethod.GET },
  // { path: 'partMold/notApproved', method: RequestMethod.GET },
  // { path: 'parts/notApproved', method: RequestMethod.GET },
  // { path: 'partStatus/notApproved', method: RequestMethod.GET },
  // { path: 'qPart/notApproved', method: RequestMethod.GET },
  // { path: 'sculpture/notApproved', method: RequestMethod.GET },
  // { path: 'sculpture/notApprovedInventory', method: RequestMethod.GET },
  // { path: 'sculptureInventory/notApproved', method: RequestMethod.GET },
  // { path: 'similarColor/notApproved', method: RequestMethod.GET },
  // { path: 'user/recover', method: RequestMethod.POST },
  // { path: 'userFavorite', method: RequestMethod.GET },
  // { path: 'userGoal', method: RequestMethod.GET },
  // { path: 'userInventory', method: RequestMethod.GET },
  // { path: 'userPreference', method: RequestMethod.GET },
  // )

  // configure(consumer: MiddlewareConsumer) {
  // consumer.apply(AdminMiddleware).forRoutes(CategoriesController);
  //admin MW
  // consumer
  //   .apply(AdminMiddleware)
  //   .exclude(
  //     { path: 'auth/login', method: RequestMethod.POST },
  //     { path: 'categories/add', method: RequestMethod.POST },
  //     { path: 'categories', method: RequestMethod.GET },
  //     { path: 'categories/(.*)', method: RequestMethod.GET },
  //     { path: 'color/add', method: RequestMethod.POST },
  //     { path: 'color', method: RequestMethod.GET },
  //     { path: 'color/(.*)', method: RequestMethod.GET },
  //     { path: 'elementID/add', method: RequestMethod.POST },
  //     { path: 'elementID', method: RequestMethod.GET },
  //     { path: 'elementID/(.*)', method: RequestMethod.GET },
  //     { path: 'image/upload', method: RequestMethod.POST },
  //     { path: 'image', method: RequestMethod.GET },
  //     { path: 'image/(.*)', method: RequestMethod.GET },
  //     { path: 'comment', method: RequestMethod.ALL },
  //     { path: 'comment/(.*)', method: RequestMethod.ALL },
  //     { path: 'message', method: RequestMethod.ALL },
  //     { path: 'message/(.*)', method: RequestMethod.ALL },
  //     { path: 'partMold', method: RequestMethod.GET },
  //     { path: 'partMold/(.*)', method: RequestMethod.GET },
  //     { path: 'parts/add', method: RequestMethod.POST },
  //     { path: 'parts', method: RequestMethod.GET },
  //     { path: 'parts/(.*)', method: RequestMethod.GET },
  //     { path: 'partStatus/add', method: RequestMethod.POST },
  //     { path: 'partStatus/mass', method: RequestMethod.POST },
  //     { path: 'partStatus', method: RequestMethod.GET },
  //     { path: 'partStatus/(.*)', method: RequestMethod.GET },
  //     { path: 'predefinedSecurityQuestion', method: RequestMethod.GET },
  //     { path: 'predefinedSecurityQuestion/(.*)', method: RequestMethod.GET },
  //     { path: 'qpart/add', method: RequestMethod.POST },
  //     { path: 'qpart/mass', method: RequestMethod.POST },
  //     { path: 'qpart', method: RequestMethod.GET },
  //     { path: 'qpart/(.*)', method: RequestMethod.GET },
  //     { path: 'rating', method: RequestMethod.ALL },
  //     { path: 'rating/(.*)', method: RequestMethod.ALL },
  //     { path: 'sculpture/add', method: RequestMethod.POST },
  //     { path: 'sculpture', method: RequestMethod.GET },
  //     { path: 'sculpture/(.*)', method: RequestMethod.GET },
  //     {
  //       path: 'sculptureInventory/addParts/(.*)',
  //       method: RequestMethod.POST,
  //     },
  //     { path: 'sculptureInventory', method: RequestMethod.GET },
  //     { path: 'sculptureInventory/(.*)', method: RequestMethod.GET },
  //     { path: 'securityQuestion', method: RequestMethod.ALL },
  //     { path: 'securityQuestion/(.*)', method: RequestMethod.ALL },
  //     { path: 'similarColor/add', method: RequestMethod.POST },
  //     { path: 'similarColor', method: RequestMethod.GET },
  //     { path: 'similarColor/(.*)', method: RequestMethod.GET },
  //     { path: 'title', method: RequestMethod.GET },
  //     { path: 'title/(.*)', method: RequestMethod.GET },
  //     { path: 'user/register', method: RequestMethod.POST },
  //     { path: 'user/recover', method: RequestMethod.POST },
  //     { path: 'user', method: RequestMethod.GET },
  //     { path: 'user/(.*)', method: RequestMethod.GET },
  //     { path: 'userFavorite', method: RequestMethod.ALL },
  //     { path: 'userFavorite/(.*)', method: RequestMethod.ALL },
  //     { path: 'userGoal', method: RequestMethod.ALL },
  //     { path: 'userGoal/(.*)', method: RequestMethod.ALL },
  //     { path: 'userInventory', method: RequestMethod.ALL },
  //     { path: 'userInventory/(.*)', method: RequestMethod.ALL },
  //     { path: 'userPreference', method: RequestMethod.ALL },
  //     { path: 'userPreference/(.*)', method: RequestMethod.ALL },
  //     { path: 'userTitle', method: RequestMethod.ALL },
  //     { path: 'userTitle/(.*)', method: RequestMethod.ALL },
  //     { path: 'categories/apporve', method: RequestMethod.POST },
  //   )
  //   .forRoutes({ path: '*', method: RequestMethod.ALL });

  // }
}
