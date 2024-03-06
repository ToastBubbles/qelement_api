import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { IAPIResponse, purpleColor, resetColor } from 'src/interfaces/general';

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

  static async findByUserId(userId: number): Promise<SubmissionCount | null> {
    return this.findOne<SubmissionCount>({
      where: { userId },
    });
  }

  static async increaseApproved(
    userId: number,
    decreasePending: boolean,
  ): Promise<IAPIResponse> {
    const submissionObj = await this.findOne<SubmissionCount>({
      where: { userId },
    });
    console.log(
      `${purpleColor}~~~~~~~~~~~~~~~ Increasing Approved. Decreasing Pending: ${decreasePending} for ${userId} ~~~~~~~~~~~~~~~~~~${resetColor}`,
    );

    if (submissionObj) {
      let newPendingValue = submissionObj.totalPending;
      if (decreasePending) {
        if (newPendingValue - 1 < 0) {
          newPendingValue = 0;
        } else {
          newPendingValue - 1;
        }
      }
      await submissionObj.update({
        totalApproved: submissionObj.totalApproved + 1,
        totalPending: newPendingValue,
      });
      await submissionObj.save();
      return { code: 200, message: 'success' };
    }
    return { code: 500, message: 'error' };
  }

  static async increasePending(userId: number): Promise<IAPIResponse> {
    const submissionObj = await this.findOne<SubmissionCount>({
      where: { userId },
    });
    console.log(
      `${purpleColor}~~~~~~~~~~~~~~~ Increasing Pending for ${userId} ~~~~~~~~~~~~~~~~~~${resetColor}`,
    );
    if (submissionObj) {
      await submissionObj.update({
        totalPending: submissionObj.totalPending + 1,
      });
      await submissionObj.save();
      return { code: 200, message: 'success' };
    }
    return { code: 500, message: 'error' };
  }

  static async decreasePending(userId: number): Promise<IAPIResponse> {
    const submissionObj = await this.findOne<SubmissionCount>({
      where: { userId },
    });
    console.log(
      `${purpleColor}~~~~~~~~~~~~~~~ Decresing Pending for ${userId} ~~~~~~~~~~~~~~~~~~${resetColor}`,
    );
    if (submissionObj) {
      let newPendingValue = submissionObj.totalPending;

      if (newPendingValue - 1 < 0) {
        return { code: 501, message: 'cannot decrease value!' };
      } else {
        newPendingValue - 1;
      }
      await submissionObj.update({
        totalPending: newPendingValue,
      });
      await submissionObj.save();
      return { code: 200, message: 'success' };
    }
    return { code: 500, message: 'error' };
  }

  static async decreaseApproved(userId: number): Promise<IAPIResponse> {
    const submissionObj = await this.findOne<SubmissionCount>({
      where: { userId },
    });
    console.log(
      `${purpleColor}~~~~~~~~~~~~~~~ Decresing Approved for ${userId} ~~~~~~~~~~~~~~~~~~${resetColor}`,
    );
    if (submissionObj) {
      let newApprovedValue = submissionObj.totalApproved;

      if (newApprovedValue - 1 < 0) {
        return { code: 501, message: 'cannot decrease value!' };
      } else {
        newApprovedValue - 1;
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
