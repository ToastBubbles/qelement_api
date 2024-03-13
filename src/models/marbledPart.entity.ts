import {
  Table,
  Column,
  Model,
  HasMany,
  ForeignKey,
  BelongsTo,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { MarbledPartColor } from './marbledPartColor.entity';
import { PartMold } from './partMold.entity';
import { DataTypes } from 'sequelize';
import { Image } from './image.entity';
import { User } from './user.entity';
import { Color } from './color.entity';
import { Part } from './part.entity';
import { SubmissionCount } from './submissionCount.entity';

@Table
export class MarbledPart extends Model {
  @ForeignKey(() => PartMold)
  @Column({
    type: DataTypes.INTEGER,
  })
  moldId: number;

  @BelongsTo(() => PartMold)
  mold: PartMold;

  @HasMany(() => MarbledPartColor)
  colors: MarbledPartColor[];

  @HasMany(() => Image)
  images: Image[];

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column({ defaultValue: '', type: DataTypes.STRING(255) })
  note: string;

  @Column({ defaultValue: false })
  isMoldUnknown: boolean;

  @Column
  approvalDate: Date;

  static async findByMoldId(moldId: number): Promise<MarbledPart[]> {
    return this.findAll<MarbledPart>({
      where: { moldId },
    });
  }

  static async findByCreatorId(creatorId: number): Promise<MarbledPart[]> {
    return this.findAll<MarbledPart>({
      where: { creatorId },
      include: [
        { model: MarbledPartColor, include: [Color] },
        Image,
        { model: PartMold, include: [Part] },
      ],
    });
  }

  @AfterCreate
  static async increaseSubmissionCount(instance: MarbledPart) {
    if (instance.approvalDate != null) {
      await SubmissionCount.increaseApproved(instance.creatorId, false);
    } else {
      await SubmissionCount.increasePending(instance.creatorId);
    }
  }
  @AfterUpdate
  static async handleSubmissionCount(instance: MarbledPart) {
    const previousApprovalDate = instance.previous('approvalDate');
    const currentApprovalDate = instance.approvalDate;

    console.log(previousApprovalDate, currentApprovalDate);
    if (previousApprovalDate === null && currentApprovalDate !== null) {
      await SubmissionCount.increaseApproved(instance.creatorId, true);
    }
  }

  @AfterDestroy
  static async deleteAssociatedModels(instance: MarbledPart) {
    const previousApprovalDate = instance.previous('approvalDate');
    if (previousApprovalDate === null) {
      await SubmissionCount.decreasePending(instance.creatorId);
    }

    await MarbledPartColor.destroy({
      where: {
        marbledPartId: instance.id,
      },
    });

    await Image.destroy({
      where: {
        marbledpartId: instance.id,
      },
    });
  }
}
