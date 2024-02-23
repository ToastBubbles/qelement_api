import { Controller, Get } from '@nestjs/common';
import { Notification } from 'src/models/notification.entity';
import { NotificationsService } from '../services/notification.service';

@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }
}
