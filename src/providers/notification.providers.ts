import { Notification } from "src/models/notification.entity";


export const notificationsProviders = [
  {
    provide: 'NOTIFICATION_REPOSITORY',
    useValue: Notification,
  },
];
