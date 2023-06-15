import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import {
  IExtendedMessageDTO,
  IMailbox,
  IMessageDTO,
} from 'src/interfaces/general';
import { Message } from 'src/models/message.entity';
import { MessagesService } from '../services/message.service';
import { trimAndReturn } from 'src/utils/utils';

@Controller('message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @Get('/:id')
  async getMessageById(@Param('id') id: number): Promise<IExtendedMessageDTO> {
    return this.messagesService.findByIdAsDTO(id);
  }

  @Get('/getAllById/:id')
  async getAllMessagesByUserID(@Param('id') id: number): Promise<IMailbox> {
    return this.messagesService.findAllByUserID(id);
  }

  @Get('/getUnreadCountById/:id')
  async getUnreadCountByUserID(@Param('id') id: number): Promise<number> {
    return this.messagesService.findUnreadCountByUserID(id);
  }

  @Post()
  async sendMessage(
    @Body()
    messageDTO: IMessageDTO,
  ) {
    try {
      let newMessage = new Message({
        subject: trimAndReturn(messageDTO.subject),
        content: trimAndReturn(messageDTO.body),
        senderId: messageDTO.senderId,
        recipientId: messageDTO.recipientId,
      });
      newMessage.save();
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/delete/:id')
  async markMessageDelete(@Param('id') id: number) {
    try {
      let msg = await this.messagesService.findById(id);
      if (msg) {
        // msg.update({ deletedAt: Date.now });
        msg.destroy();
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/read/:id')
  async markMessageRead(@Param('id') id: number) {
    try {
      let msg = await this.messagesService.findById(id);
      if (msg) {
        // msg.read = true;
        // msg.save();
        msg.update({ read: true });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
