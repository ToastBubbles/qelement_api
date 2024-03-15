import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { QPart } from './qPart.entity';
import { NotificationSubscription } from './notificationSubscription.entity';
import { Color } from './color.entity';
import { PartMold } from './partMold.entity';
import { Part } from './part.entity';

@Table
export class Notification extends Model {
  @Column
  name: string;

  @Column
  type: string;

  @Column
  content: string;

  @Column
  link: string;

  @Column({ defaultValue: false })
  read: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  static async createQPartNotification(instance: QPart) {
    try {
      const mold = await PartMold.findByPk(instance.moldId);
      if (!mold) return;

      const colorSubscriptions = await NotificationSubscription.findByColorId(
        instance.colorId,
      );
      const partSubscriptions = await NotificationSubscription.findByPartId(
        mold.parentPartId,
      );
      const moldSubscriptions = await NotificationSubscription.findByMoldId(
        instance.moldId,
      );

      const allSubscriptions = [
        ...colorSubscriptions,
        ...partSubscriptions,
        ...moldSubscriptions,
      ];

      let addedUserIds: number[] = [];
      if (allSubscriptions.length > 0) {
        const color = await Color.findByPk(instance.colorId);
        if (!color) return;
        const part = await Part.findByPk(mold.parentPartId);
        if (!part) return;
        await Promise.all(
          allSubscriptions.map(async (sub) => {
            if (!addedUserIds.includes(sub.userId)) {
              addedUserIds.push(sub.userId);
              const colorName =
                color.bl_name.length > 0 ? color.bl_name : color.tlg_name;
              await this.create({
                name: 'New QPart added',
                type: 'qpart',
                content: `${part.name} (${mold.number}${
                  instance.isMoldUnknown ? '*' : ''
                }) ${colorName}`,
                link: `/part/${mold.parentPartId}?color=${instance.colorId}&mold=${instance.moldId}`,
                userId: sub.userId,
              });
            }
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
