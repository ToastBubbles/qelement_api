import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';
import { SubmissionCount } from './submissionCount.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class ElementID extends Model {
  @Column({ unique: true })
  number: number;

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

  static async findByCreatorId(creatorId: number): Promise<ElementID[]> {
    return this.findAll<ElementID>({
      where: { creatorId },
    });
  }
  @AfterCreate
  static async increaseSubmissionCount(instance: ElementID) {
    if (instance.approvalDate != null) {
      await SubmissionCount.increaseApproved(instance.creatorId, false);
    } else {
      await SubmissionCount.increasePending(instance.creatorId);
    }
  }
  @AfterUpdate
  static async handleSubmissionCount(instance: ElementID) {
    const previousApprovalDate = instance.previous('approvalDate');
    const currentApprovalDate = instance.approvalDate;

    if (previousApprovalDate === null && currentApprovalDate !== null) {
      await SubmissionCount.increaseApproved(instance.creatorId, true);
    }
  }
  @AfterDestroy
  static async deleteAssociatedModels(instance: ElementID) {
    const previousApprovalDate = instance.previous('approvalDate');
    if (previousApprovalDate === null) {
      await SubmissionCount.decreasePending(instance.creatorId);
    }
  }
}
