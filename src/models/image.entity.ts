import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DeletedAt,
  BeforeSave,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';
import { DataTypes } from 'sequelize';
import { Sculpture } from './sculpture.entity';
import { SubmissionCount } from './submissionCount.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Image extends Model {
  @Column
  path: string;

  @Column
  fileName: string;

  @Column({
    type: DataTypes.ENUM(
      'part',
      'supplemental',
      'sculpture',
      'damaged',
      'other',
      'pfp',
    ),
    defaultValue: 'part',
  })
  type: string;

  @Column({ defaultValue: false })
  isPrimary: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  uploader: User;

  @ForeignKey(() => QPart)
  @Column
  qpartId?: number;

  @BelongsTo(() => QPart)
  qpart?: QPart;

  @ForeignKey(() => Sculpture)
  @Column
  sculptureId?: number;

  @BelongsTo(() => Sculpture)
  sculpture?: Sculpture;

  @Column
  approvalDate: Date;

  static async findByCreatorId(creatorId: number): Promise<Image[]> {
    return this.findAll<Image>({
      where: { userId: creatorId },
    });
  }

  @AfterCreate
  static async increaseSubmissionCount(instance: Image) {
    if (instance.type != 'pfp') {
      if (instance.approvalDate != null) {
        await SubmissionCount.increaseApproved(instance.userId, false);
      } else {
        await SubmissionCount.increasePending(instance.userId);
      }
    }
  }
  @AfterUpdate
  static async handleSubmissionCount(instance: Image) {
    if (instance.type != 'pfp') {
      const previousApprovalDate = instance.previous('approvalDate');
      const currentApprovalDate = instance.approvalDate;

      if (previousApprovalDate === null && currentApprovalDate !== null) {
        await SubmissionCount.increaseApproved(instance.userId, true);
      }
    }
  }
  @AfterDestroy
  static async deleteAssociatedModels(instance: Image) {
    if (instance.type != 'pfp') {
      const previousApprovalDate = instance.previous('approvalDate');
      if (previousApprovalDate === null) {
        await SubmissionCount.decreasePending(instance.userId);
      }
    }
  }
}
