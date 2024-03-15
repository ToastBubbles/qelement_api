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
  async findById(id: number): Promise<Notification | null> {
    return this.notificationsRepository.findOne<Notification>({
      where: { id },
    });
  }

  async findAllByUserId(userId: number): Promise<Notification[]> {
    return this.notificationsRepository.findAll<Notification>({
      where: { userId },
    });
  }

  async findAllUnreadByUserId(userId: number): Promise<Notification[]> {
    return this.notificationsRepository.findAll<Notification>({
      where: { userId, read: false },
    });
  }
}
