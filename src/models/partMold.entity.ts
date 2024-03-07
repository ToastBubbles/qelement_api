import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
  HasMany,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { Part } from './part.entity';
import { User } from './user.entity';
import { UserGoal } from './userGoal.entity';
import { QPart } from './qPart.entity';
import { SubmissionCount } from './submissionCount.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class PartMold extends Model {
  @Column({
    unique: true,
  })
  number: string;

  @Column
  note: string;

  @ForeignKey(() => Part)
  @Column
  parentPartId: number;
  @BelongsTo(() => Part)
  parentPart: Part;

  @HasMany(() => UserGoal)
  goals: UserGoal[];

  @HasMany(() => QPart)
  qparts: QPart[];

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;
  @Column
  approvalDate: Date;

  static async findByParentPartID(partId: number): Promise<PartMold[]> {
    return this.findAll<PartMold>({
      where: { parentPartId: partId },
    });
  }

  
  static async findByCreatorId(creatorId: number): Promise<PartMold[]> {
    return this.findAll<PartMold>({
      where: { creatorId },
    });
  }

  @AfterCreate
  static async increaseSubmissionCount(instance: PartMold) {
    if (instance.approvalDate != null) {
      await SubmissionCount.increaseApproved(instance.creatorId, false);
    } else {
      await SubmissionCount.increasePending(instance.creatorId);
    }
  }
  @AfterUpdate
  static async handleSubmissionCount(instance: PartMold) {
    const previousApprovalDate = instance.previous('approvalDate');
    const currentApprovalDate = instance.approvalDate;

    if (previousApprovalDate === null && currentApprovalDate !== null) {
      await SubmissionCount.increaseApproved(instance.creatorId, true);
    }
  }
  @AfterDestroy
  static async deleteAssociatedModels(instance: PartMold) {
    const previousApprovalDate = instance.previous('approvalDate');
    if (previousApprovalDate === null) {
      await SubmissionCount.decreasePending(instance.creatorId);
    }
  }
}
