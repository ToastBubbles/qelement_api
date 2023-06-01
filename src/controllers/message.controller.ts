import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import {
  IExtendedMessageDTO,
  IMailbox,
  IMessageDTO,
} from 'src/interfaces/general';
import { Message } from 'src/models/message.entity';
import { MessagesService } from '../services/message.service';

@Controller('message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @Get('/:id')
  async getMessageById(@Param('id') id: number): Promise<IExtendedMessageDTO> {
    return this.messagesService.findById(id);
  }

  @Get('/getAllById/:id')
  async getAllMessagesByUserID(@Param('id') id: number): Promise<IMailbox> {
    return this.messagesService.findAllByUserID(id);
  }

  @Post()
  async sendMessage(
    @Body()
    messageDTO: IMessageDTO,
  ) {
    try {
      let newMessage = new Message({
        subject: messageDTO.subject,
        content: messageDTO.body,
        senderId: messageDTO.senderId,
        recipientId: messageDTO.recipientId,
      });
      newMessage.save();
    } catch (error) {
      console.log(error);
    }
  }
}
