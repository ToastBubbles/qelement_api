import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Op } from 'sequelize';
import { IExtendedMessageDTO, IMailbox } from 'src/interfaces/general';
import { User } from 'src/models/user.entity';
import { Message } from '../models/message.entity';
import { UsersService } from './user.service';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private messagesRepository: typeof Message,
    private readonly userService: UsersService,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messagesRepository.findAll<Message>();
  }
  async findUnreadCountByUserID(id: number): Promise<number> {
    const results = await this.messagesRepository.findAll({
      where: {
        recipientId: id,
      },
    });

    if (results) {
      let count = 0;
      results.forEach((msg) => {
        if (!msg.read) {
          count++;
        }
      });
      return count;
    } else return 0;
  }

  async findById(id: number): Promise<Message | undefined> {
    let result = await this.messagesRepository.findOne({
      where: {
        id,
      },
    });
    if (result) return result;
    return undefined;
  }

  async findByIdAsDTO(id: number): Promise<IExtendedMessageDTO> {
    const users = await this.userService.findAll();
    const result = await this.messagesRepository.findOne({
      where: {
        id,
      },
    });
    let checksender = users.find((u) => u.id == result?.senderId);
    let checkrecipient = users.find((u) => u.id == result?.recipientId);
    let resultConvert: IExtendedMessageDTO = {
      id: result?.id,
      recipientId: result?.recipientId || -1,
      senderId: result?.senderId || -1,
      recipientName: checkrecipient?.name || 'Unknown',
      senderName: checksender?.name || 'Unknown',
      subject: result?.subject || 'No Subject',
      body: result?.content || 'No Content',
      read: result?.read || false,
      createdAt: result?.createdAt,
    };
    if (result) return resultConvert;
    throw new HttpException('Message not found', 404);
  }

  async findAllByUserID(id: number): Promise<IMailbox> {
    //example of Or operator
    let outbox: any[] = [];
    let inbox: any[] = [];
    const results = await this.messagesRepository.findAll({
      where: {
        [Op.or]: [{ recipientId: id }, { senderId: id }],
      },
    });
    const users = await this.userService.findAll();

    results.forEach((msg) => {
      //   console.log(
      //     '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
      //   );
      let msgConvert: IExtendedMessageDTO = {
        id: msg.id,
        recipientId: msg.recipientId,
        senderId: msg.senderId,
        recipientName: '',
        senderName: '',
        subject: msg.subject,
        body: msg.content,
        read: msg.read,
        createdAt: msg.createdAt,
      };
      let checksender = users.find((u) => u.id == msg.senderId);
      let checkrecipient = users.find((u) => u.id == msg.recipientId);

      if (checksender != undefined) {
        msgConvert.senderName = checksender.name;
      }
      if (checkrecipient != undefined) {
        msgConvert.recipientName = checkrecipient.name;
      }

      if (msgConvert.recipientId == id) {
        inbox.push(msgConvert);
      } else {
        outbox.push(msgConvert);
      }
      //   console.log('conv:', msgConvert);
    });

    let output = {
      inbox,
      outbox,
    };
    // console.log(output);

    return output;
  }
}
