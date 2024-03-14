import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { IAPIResponse, iIdOnly } from 'src/interfaces/general';
import { Color } from 'src/models/color.entity';
import { NotificationSubscription } from 'src/models/notificationSubscription.entity';
import { User } from 'src/models/user.entity';
import { NotificationSubscriptionsService } from 'src/services/notificationSubscription.service';

@Controller('notificationSubscription')
export class NotificationSubscriptionsController {
  constructor(
    private readonly notificationSubscriptionsService: NotificationSubscriptionsService,
  ) {}

  @Get('/all')
  async getAllNotificationSubscriptions(): Promise<NotificationSubscription[]> {
    return this.notificationSubscriptionsService.findAll();
  }

  @Post('/add/color')
  async addColorSubscription(
    @Body()
    data: iIdOnly,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 501, message: 'User not found' };
      if (data.id <= 0) return { code: 502, message: 'Bad ID' };
      const color = await Color.findByPk(data.id);

      if (color) {
        const existingSubscription =
          await this.notificationSubscriptionsService.checkIfColorSubExists(
            userId,
            color.id,
          );
        if (!existingSubscription) {
          await NotificationSubscription.create({
            userId,
            colorId: color.id,
          });
          return { code: 200, message: `Subscription created!` };
        }
        return { code: 503, message: `Subscription already exists!` };
      }

      return { code: 500, message: `Subscription failed to be added` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `Generic error` };
    }
  }
}
