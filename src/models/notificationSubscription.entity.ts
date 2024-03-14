import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { PartMold } from './partMold.entity';
import { QPart } from './qPart.entity';
import { Part } from './part.entity';
import { User } from './user.entity';
import { Color } from './color.entity';

@Table
export class NotificationSubscription extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => QPart)
  @Column
  qpartId?: number;

  @BelongsTo(() => QPart)
  qpart?: QPart;

  @ForeignKey(() => Part)
  @Column
  partId?: number;

  @BelongsTo(() => Part)
  part?: Part;

  @ForeignKey(() => PartMold)
  @Column
  moldId?: number;

  @BelongsTo(() => PartMold)
  mold?: PartMold;

  @ForeignKey(() => Color)
  @Column
  colorId?: number;

  @BelongsTo(() => Color)
  color?: Color;

  static async findByQPartId(
    qpartId: number,
  ): Promise<NotificationSubscription[]> {
    return this.findAll<NotificationSubscription>({
      where: { qpartId },
    });
  }

  static async findByColorId(
    colorId: number,
  ): Promise<NotificationSubscription[]> {
    return this.findAll<NotificationSubscription>({
      where: { colorId },
    });
  }

  static async findByPartId(
    partId: number,
  ): Promise<NotificationSubscription[]> {
    return this.findAll<NotificationSubscription>({
      where: { partId },
    });
  }

  static async findByMoldId(
    moldId: number,
  ): Promise<NotificationSubscription[]> {
    return this.findAll<NotificationSubscription>({
      where: { moldId },
    });
  }
}
