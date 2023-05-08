
    import { Injectable, Inject } from '@nestjs/common';
    import { Message } from '../models/message.entity';

    @Injectable()
    export class MessagesService {
    constructor(
        @Inject('MESSAGE_REPOSITORY')
        private messagesRepository: typeof Message,
    ) {}
    
    async findAll(): Promise<Message[]> {
        return this.messagesRepository.findAll<Message>();
    }
    }
    