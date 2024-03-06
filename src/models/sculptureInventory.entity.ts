import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { Sculpture } from './sculpture.entity';
import { User } from './user.entity';
import { SubmissionCount } from './submissionCount.entity';

@Table({
  timestamps: true,
  paranoid: true,
  indexes: [{ fields: ['sculptureId', 'qpartId'], unique: true }],
})
export class SculptureInventory extends Model {
  @ForeignKey(() => QPart)
  @Column({ unique: false })
  qpartId: number;

  @BelongsTo(() => QPart)
  qpart: QPart;

  @ForeignKey(() => Sculpture)
  @Column({ unique: false })
  sculptureId: number;

  @BelongsTo(() => Sculpture)
  sculpture: Sculpture;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column
  approvalDate: Date;

  static async findByCreatorId(
    creatorId: number,
  ): Promise<SculptureInventory[]> {
    return this.findAll<SculptureInventory>({
      where: { creatorId },
    });
  }

  @AfterCreate
  static async increaseSubmissionCount(instance: SculptureInventory) {
    if (instance.approvalDate != null) {
      await SubmissionCount.increaseApproved(instance.creatorId, false);
    } else {
      await SubmissionCount.increasePending(instance.creatorId);
    }
  }
  @AfterUpdate
  static async handleSubmissionCount(instance: SculptureInventory) {
    const previousInstance = instance.previous();
    const previousApprovalDate = previousInstance.getDataValue('approvalDate');
    const currentApprovalDate = instance.approvalDate;

    if (previousApprovalDate === null && currentApprovalDate !== null) {
      await SubmissionCount.increaseApproved(instance.creatorId, true);
    }
  }
}
