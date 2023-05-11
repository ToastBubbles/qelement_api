import { Controller, Get } from '@nestjs/common';
import { Message } from 'src/models/message.entity';
import { MessagesService } from '../services/message.service';

@Controller('message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return this.messagesService.findAll();
  }
}
