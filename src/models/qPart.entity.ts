import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  BelongsToMany,
  DeletedAt,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeSave,
  AfterDestroy,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript';
import { Color } from './color.entity';
import { Comment } from './comment.entity';
import { Image } from './image.entity';
import { Part } from './part.entity';
import { PartStatus } from './partStatus.entity';
import { RaretyRating } from './raretyRating.entity';
import { User } from './user.entity';
import { UserFavorite } from './userFavorite.entity';
import { UserInventory } from './userInventory.entity';
import { PartMold } from './partMold.entity';
import { DataTypes } from 'sequelize';
import { ElementID } from './elementID.entity';
import { Sculpture } from './sculpture.entity';
import { SculptureInventory } from './sculptureInventory.entity';
import { Op } from 'sequelize';
import { SubmissionCount } from './submissionCount.entity';
import { Notification } from './notification.entity';
import { NotificationSubscription } from './notificationSubscription.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class QPart extends Model {
  @Column({
    type: DataTypes.ENUM(
      'qelement',
      'nightshift',
      'prototype',
      'test',
      'employee',
      'other',
      'unknown',
    ),
    defaultValue: 'other',
  })
  type: string;

  @Column({ defaultValue: '', type: DataTypes.STRING(255) })
  note: string;

  @ForeignKey(() => PartMold)
  @Column
  moldId: number;

  @BelongsTo(() => PartMold)
  mold: PartMold;

  @Column({ defaultValue: false })
  isMoldUnknown: boolean;

  @ForeignKey(() => Color)
  @Column
  colorId: number;

  @BelongsTo(() => Color)
  color: Color;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => PartStatus)
  partStatuses: PartStatus[];

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => ElementID)
  elementIDs: ElementID[];

  @HasMany(() => Image)
  images: Image[];

  @HasMany(() => RaretyRating)
  ratings: RaretyRating[];

  @BelongsToMany(() => User, {
    through: { model: () => UserFavorite, unique: false },
  })
  userFavorites: User[];

  @BelongsToMany(() => User, {
    through: { model: () => UserInventory, unique: false },
  })
  userInventories: User[];

  @BelongsToMany(() => Sculpture, {
    through: { model: () => SculptureInventory, unique: false },
  })
  sculptureInventories: Sculpture[];

  @Column
  approvalDate: Date;

  static async findByMoldId(moldId: number): Promise<QPart[]> {
    return this.findAll<QPart>({
      where: { moldId },
    });
  }

  static async findByCreatorId(creatorId: number): Promise<QPart[]> {
    return this.findAll<QPart>({
      where: { creatorId },
      include: [
        {
          model: ElementID,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        { model: PartMold, include: [Part] },
        Color,
        { model: User, as: 'creator' },
        RaretyRating,
        {
          model: PartStatus,
          where: {
            approvalDate: {
              [Op.ne]: null,
            },
          },
          required: false,
        },
        {
          model: Image,
          include: [{ model: User, as: 'uploader' }],
        },
      ],
    });
  }

  @AfterCreate
  static async increaseSubmissionCount(instance: QPart) {
    if (instance.approvalDate != null) {
      await SubmissionCount.increaseApproved(instance.creatorId, false);
    } else {
      await SubmissionCount.increasePending(instance.creatorId);
    }
  }
  @AfterUpdate
  static async handleSubmissionCount(instance: QPart) {
    try {
      const previousApprovalDate = instance.previous('approvalDate');

      const currentApprovalDate = instance.approvalDate;

      if (previousApprovalDate === null && currentApprovalDate !== null) {
        let subsriptions = await NotificationSubscription.findByColorId(
          instance.colorId,
        );
        if (subsriptions.length > 0) {
          let colorName =
            instance.color.bl_name.length > 0
              ? instance.color.bl_name
              : instance.color.tlg_name;
          Promise.all(
            subsriptions.map(
              async (sub) =>
                await Notification.create({
                  name: `New QPart added.`,
                  type: 'color',
                  content: `New QPart in ${colorName}`,
                  link: `/part/${instance.mold.parentPartId}?color=${instance.colorId}&mold=${instance.moldId}`,
                  userId: sub.userId,
                }),
            ),
          );
        }
        await SubmissionCount.increaseApproved(instance.creatorId, true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  @AfterDestroy
  static async deleteAssociatedModels(instance: QPart) {
    const previousApprovalDate = instance.previous('approvalDate');
    if (previousApprovalDate === null) {
      await SubmissionCount.decreasePending(instance.creatorId);
    }

    await ElementID.destroy({
      where: {
        qpartId: instance.id,
      },
    });

    await Comment.destroy({
      where: {
        qpartId: instance.id,
      },
    });

    await UserInventory.destroy({
      where: {
        qpartId: instance.id,
      },
    });

    await UserFavorite.destroy({
      where: {
        qpartId: instance.id,
      },
    });

    await SculptureInventory.destroy({
      where: {
        qpartId: instance.id,
      },
    });

    await RaretyRating.destroy({
      where: {
        qpartId: instance.id,
      },
    });

    await PartStatus.destroy({
      where: {
        qpartId: instance.id,
      },
    });

    await Image.destroy({
      where: {
        qpartId: instance.id,
      },
    });
  }
}
