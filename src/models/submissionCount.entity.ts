import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { IAPIResponse } from 'src/interfaces/general';

@Table
export class SubmissionCount extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({ defaultValue: 0 })
  totalPending: number;

  @Column({ defaultValue: 0 })
  totalApproved: number;

  @BelongsTo(() => User)
  user: User;

  static async findByCreatorId(
    creatorId: number,
  ): Promise<SubmissionCount | null> {
    return this.findOne<SubmissionCount>({
      where: { creatorId },
    });
  }

  static async increaseApproved(
    creatorId: number,
    decreasePending: boolean,
  ): Promise<IAPIResponse> {
    const submissionObj = await this.findOne<SubmissionCount>({
      where: { creatorId },
    });

    if (submissionObj) {
      let newPendingValue = submissionObj.totalPending;
      if (decreasePending) {
        if (newPendingValue - 1 < 0) {
          newPendingValue = 0;
        } else {
          newPendingValue--;
        }
      }
      await submissionObj.update({
        totalApproved: submissionObj.totalApproved++,
        totalPending: newPendingValue,
      });
      await submissionObj.save();
      return { code: 200, message: 'success' };
    }
    return { code: 500, message: 'error' };
  }

  static async increasePending(creatorId: number): Promise<IAPIResponse> {
    const submissionObj = await this.findOne<SubmissionCount>({
      where: { creatorId },
    });

    if (submissionObj) {
      await submissionObj.update({
        totalPending: submissionObj.totalPending++,
      });
      await submissionObj.save();
      return { code: 200, message: 'success' };
    }
    return { code: 500, message: 'error' };
  }

  static async decreasePending(creatorId: number): Promise<IAPIResponse> {
    const submissionObj = await this.findOne<SubmissionCount>({
      where: { creatorId },
    });

    if (submissionObj) {
      let newPendingValue = submissionObj.totalPending;

      if (newPendingValue - 1 < 0) {
        return { code: 501, message: 'cannot decrease value!' };
      } else {
        newPendingValue--;
      }
      await submissionObj.update({
        totalPending: newPendingValue,
      });
      await submissionObj.save();
      return { code: 200, message: 'success' };
    }
    return { code: 500, message: 'error' };
  }


  static async decreaseApproved(creatorId: number): Promise<IAPIResponse> {
    const submissionObj = await this.findOne<SubmissionCount>({
      where: { creatorId },
    });

    if (submissionObj) {
      let newApprovedValue = submissionObj.totalApproved;

      if (newApprovedValue - 1 < 0) {
        return { code: 501, message: 'cannot decrease value!' };
      } else {
        newApprovedValue--;
      }
      await submissionObj.update({
        totalApproved: newApprovedValue,
      });
      await submissionObj.save();
      return { code: 200, message: 'success' };
    }
    return { code: 500, message: 'error' };
  }
}
