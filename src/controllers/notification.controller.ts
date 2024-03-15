import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Notification } from 'src/models/notification.entity';
import { NotificationsService } from '../services/notification.service';
import { User } from 'src/models/user.entity';
import { IAPIResponse } from 'src/interfaces/general';

@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get('/myNotifications')
  async getNotificationsMyUserId(
    @Req() req: any,
  ): Promise<Notification[] | IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };

      let notifs = await this.notificationsService.findAllByUserId(userId);

      if (notifs) {
        return notifs;
      }
      return { code: 501, message: 'Error' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: 'Error' };
    }
  }
  @Post('/read/:id')
  async markMessageRead(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };

      let notif = await this.notificationsService.findById(id);

      if (notif) {
        if (userId != notif.userId)
          return { code: 505, message: 'User does not own this notification!' };
        await notif.update({ read: true });
        await notif.save();
        return { code: 200, message: 'Success' };
      }
      return { code: 501, message: 'Error' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: 'Error' };
    }
  }
}
