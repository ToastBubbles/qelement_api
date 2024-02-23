import { Injectable, Inject } from '@nestjs/common';
import { Notification } from 'src/models/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationsRepository: typeof Notification,
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationsRepository.findAll<Notification>();
  }
}
