
import { Module } from '@nestjs/common';
import { NotificationSubscriptionsController } from 'src/controllers/notificationSubscription.controller';
import { NotificationSubscriptionsService } from 'src/services/notificationSubscription.service';
import { notificationSubscriptionsProviders } from 'src/providers/notificationSubscription.providers';
import { DatabaseModule } from 'src/modules/database.module';

@Module({
imports: [DatabaseModule],
controllers: [NotificationSubscriptionsController],
providers: [NotificationSubscriptionsService, ...notificationSubscriptionsProviders],
})
export class NotificationSubscriptionModule {}
