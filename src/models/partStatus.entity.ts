import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DeletedAt,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';
import { DataTypes, Sequelize } from 'sequelize';
import { SubmissionCount } from './submissionCount.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class PartStatus extends Model {
  @Column({
    type: DataTypes.ENUM(
      'unknown',
      'idOnly',
      'seen',
      'found',
      'known',
      'other',
    ),
    defaultValue: 'unknown',
  })
  status: string;

  @Column({
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  })
  date: Date;

  @Column({ defaultValue: '' })
  location: string;

  @Column({ defaultValue: '' })
  note: string;

  @ForeignKey(() => QPart)
  @Column
  qpartId: number;

  @BelongsTo(() => QPart)
  qpart: QPart;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column
  approvalDate: Date;

  static async findByCreatorId(creatorId: number): Promise<PartStatus[]> {
    return this.findAll<PartStatus>({
      where: { creatorId },
    });
  }
  @AfterCreate
  static async increaseSubmissionCount(instance: PartStatus) {
    if (instance.approvalDate != null) {
      await SubmissionCount.increaseApproved(instance.creatorId, false);
    } else {
      await SubmissionCount.increasePending(instance.creatorId);
    }
  }
  @AfterUpdate
  static async handleSubmissionCount(instance: PartStatus) {
    const previousApprovalDate = instance.previous('approvalDate');
    const currentApprovalDate = instance.approvalDate;

    if (previousApprovalDate === null && currentApprovalDate !== null) {
      await SubmissionCount.increaseApproved(instance.creatorId, true);
    }
  }
  @AfterDestroy
  static async deleteAssociatedModels(instance: PartStatus) {
    const previousApprovalDate = instance.previous('approvalDate');
    if (previousApprovalDate === null) {
      await SubmissionCount.decreasePending(instance.creatorId);
    }
  }
}
