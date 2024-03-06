import {
  Table,
  Column,
  Model,
  HasMany,
  Length,
  BelongsToMany,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  AfterDestroy,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript';
import { SimilarColor } from './similarColor.entity';
import { User } from './user.entity';
import { Sculpture } from './sculpture.entity';
import { Op } from 'sequelize';
import { SubmissionCount } from './submissionCount.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Color extends Model {
  @Column
  bl_name: string;
  @Column
  tlg_name: string;
  @Column
  swatchId: number;
  @Column
  bo_id: number;
  @Column
  bo_name: string;
  @Length({ min: 6, max: 6 })
  @Column({ defaultValue: '000000' })
  hex: string;
  @Column
  bl_id: number;
  @Column
  tlg_id: number;
  @Column
  type: string;
  @Column
  note: string;
  @Column({ defaultValue: false })
  isOfficial: boolean;

  @BelongsToMany(() => Color, () => SimilarColor, 'colorId1', 'colorId2')
  similar: Color[];

  @Column
  approvalDate: Date;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  static async findByCreatorId(creatorId: number): Promise<Color[]> {
    return this.findAll<Color>({
      where: { creatorId },
    });
  }
  @AfterCreate
  static async increaseSubmissionCount(instance: Color) {
    if (instance.approvalDate != null) {
      await SubmissionCount.increaseApproved(instance.creatorId, false);
    } else {
      await SubmissionCount.increasePending(instance.creatorId);
    }
  }
  @AfterUpdate
  static async handleSubmissionCount(instance: Color) {
    const previousInstance = instance.previous();
    const previousApprovalDate = previousInstance.getDataValue('approvalDate');
    const currentApprovalDate = instance.approvalDate;

    if (previousApprovalDate === null && currentApprovalDate !== null) {
      await SubmissionCount.increaseApproved(instance.creatorId, true);
    }
  }
  @AfterDestroy
  static async deleteAssociatedModels(instance: Color) {
    // Find all users whose favoriteColorId is the same as the deleted color's id
    const affectedUsers = await User.findAll({
      where: {
        favoriteColorId: instance.id,
      },
    });

    // Set favoriteColorId to null for all affected users
    await Promise.all(
      affectedUsers.map(async (user) => {
        user.favoriteColorId = undefined;
        await user.save();
      }),
    );

    await SimilarColor.destroy({
      where: {
        [Op.or]: [{ colorId1: instance.id }, { colorId2: instance.id }],
      },
    });
  }
}
