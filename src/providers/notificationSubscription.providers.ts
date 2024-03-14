
import { NotificationSubscription } from 'src/models/notificationSubscription.entity';

export const notificationSubscriptionsProviders = [
{
provide: 'NOTIFICATIONSUBSCRIPTION_REPOSITORY',
useValue: NotificationSubscription,
},
];
