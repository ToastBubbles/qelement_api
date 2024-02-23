import { Module } from '@nestjs/common';
import { NotificationsController } from 'src/controllers/notification.controller';
import { NotificationsService } from 'src/services/notification.service';
import { notificationsProviders } from 'src/providers/notification.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, ...notificationsProviders],
})
export class NotificationModule {}
