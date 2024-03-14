
import { Injectable, Inject } from '@nestjs/common';
import { NotificationSubscription } from 'src/models/notificationSubscription.entity';

@Injectable()
export class NotificationSubscriptionsService {
constructor(
@Inject('NOTIFICATIONSUBSCRIPTION_REPOSITORY')
private notificationSubscriptionsRepository: typeof NotificationSubscription,
) {}

async findAll(): Promise<NotificationSubscription[]> {
return this.notificationSubscriptionsRepository.findAll<NotificationSubscription>();
}
}
