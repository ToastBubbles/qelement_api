
    import { Message } from '../models/message.entity';

    export const messagesProviders = [
    {
        provide: 'MESSAGE_REPOSITORY',
        useValue: Message,
    },
    ];
    