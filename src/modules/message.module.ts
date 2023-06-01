import { Module } from '@nestjs/common';
import { MessagesController } from '../controllers/message.controller';
import { MessagesService } from '../services/message.service';
import { messagesProviders } from '../providers/message.providers';
import { DatabaseModule } from './database.module';
import { UserModule } from './user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [MessagesController],
  providers: [MessagesService, ...messagesProviders],
})
export class MessageModule {}
