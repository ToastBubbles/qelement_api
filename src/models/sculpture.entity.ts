import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  BelongsToMany,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
  AfterDestroy,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { SculptureInventory } from './sculptureInventory.entity';
import { Image } from './image.entity';

import { User } from './user.entity';
import { Comment } from './comment.entity';
import { SubmissionCount } from './submissionCount.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Sculpture extends Model {
  @Column({ unique: true })
  name: string;

  @Column({
    type: DataTypes.ENUM('system', 'technic', 'duplo', 'hybrid', 'other'),
    defaultValue: 'system',
  })
  brickSystem: string;

  @Column({ type: DataTypes.STRING(50) })
  location: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true, // Now it's optional
    validate: {
      isInt: {
        msg: 'Year must be an integer.',
      },
      min: {
        args: [1932], // Minimum year, adjust as needed
        msg: 'Year must be a valid year.',
      },
      max: {
        args: [2500], // Maximum year, adjust as needed
        msg: 'Year must be a valid year.',
      },
    },
  })
  yearMade!: number | null; // Adjust the type to allow null

  @Column({
    type: DataType.INTEGER,
    allowNull: true, // Now it's optional
    validate: {
      isInt: {
        msg: 'Year must be an integer.',
      },
      min: {
        args: [1932], // Minimum year, adjust as needed
        msg: 'Year must be a valid year.',
      },
      max: {
        args: [2500], // Maximum year, adjust as needed
        msg: 'Year must be a valid year.',
      },
    },
  })
  yearRetired!: number | null; // Adjust the type to allow null

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => Image)
  images: Image[];

  @Column({
    type: DataTypes.STRING(255),
  })
  keywords: string;

  @Column({ defaultValue: '', type: DataTypes.STRING(255) })
  note: string;

  @BelongsToMany(() => QPart, {
    through: { model: () => SculptureInventory, unique: false },
  })
  inventory: QPart[];

  @HasMany(() => Comment)
  comments: Comment[];

  @Column
  approvalDate: Date;

  static async findByCreatorId(creatorId: number): Promise<Sculpture[]> {
    return this.findAll<Sculpture>({
      where: { creatorId },
    });
  }

  @AfterCreate
  static async increaseSubmissionCount(instance: Sculpture) {
    if (instance.approvalDate != null) {
      await SubmissionCount.increaseApproved(instance.creatorId, false);
    } else {
      await SubmissionCount.increasePending(instance.creatorId);
    }
  }
  @AfterUpdate
  static async handleSubmissionCount(instance: Sculpture) {
    const previousInstance = instance.previous();
    const previousApprovalDate = previousInstance.getDataValue('approvalDate');
    const currentApprovalDate = instance.approvalDate;

    if (previousApprovalDate === null && currentApprovalDate !== null) {
      await SubmissionCount.increaseApproved(instance.creatorId, true);
    }
  }

  @AfterDestroy
  static async deleteAssociatedModels(instance: Sculpture) {
    // Soft-delete associated models
    await SculptureInventory.destroy({
      where: {
        sculptureId: instance.id,
      },
    });

    // Delete associated Comments
    await Comment.destroy({
      where: {
        sculptureId: instance.id,
      },
    });

    // Delete associated Images
    await Image.destroy({
      where: {
        sculptureId: instance.id,
      },
    });
  }
}
