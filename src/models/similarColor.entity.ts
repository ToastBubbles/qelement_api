import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  Unique,
  DeletedAt,
  BelongsTo,
  AfterDestroy,
  AfterCreate,
  AfterRestore,
} from 'sequelize-typescript';
import { Color } from './color.entity';
import { User } from './user.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class SimilarColor extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Color)
  @Column
  colorId1: number;

  @BelongsTo(() => Color, { foreignKey: 'colorId1', as: 'color1' })
  color1: Color;

  @ForeignKey(() => Color)
  @Column
  colorId2: number;

  @BelongsTo(() => Color, { foreignKey: 'colorId2', as: 'color2' })
  color2: Color;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column
  approvalDate: Date;

  @AfterDestroy
  static async deleteAssociatedModels(instance: SimilarColor) {
    let inverseSimilarColor = await SimilarColor.findOne({
      where: {
        colorId1: instance.colorId2,
        colorId2: instance.colorId1,
      },
    });
    if (inverseSimilarColor) await inverseSimilarColor.destroy();
    else
      console.log(
        `Could not find simCol with c1:${instance.colorId2} c2:${instance.colorId1}`,
      );
  }

  @AfterRestore
  static async restoreAssociatedModels(instance: SimilarColor) {
    let inverseSimilarColor = await SimilarColor.findOne({
      paranoid: false, // Include soft-deleted entries
      where: {
        colorId1: instance.colorId2,
        colorId2: instance.colorId1,
      },
    });
    // If the inverse similar color does not exist (including soft-deleted entries), create it
    if (!inverseSimilarColor) {
      inverseSimilarColor = await SimilarColor.create({
        colorId1: instance.colorId2,
        colorId2: instance.colorId1,
        creatorId: instance.creatorId, // You may want to adjust this based on your requirements
        approvalDate: instance.approvalDate,
      });
    } else if (inverseSimilarColor.deletedAt !== null) {
      // If the inverse similar color exists but is soft-deleted, restore it
      await inverseSimilarColor.restore();
      await inverseSimilarColor.update({
        approvalDate: instance.approvalDate,
      });
      await inverseSimilarColor.save();
    }
  }

  @AfterCreate
  static async createInverseSimilarColor(instance: SimilarColor) {
    // Check if the inverse similar color exists, including soft-deleted entries
    let inverseSimilarColor = await SimilarColor.findOne({
      paranoid: false, // Include soft-deleted entries
      where: {
        colorId1: instance.colorId2,
        colorId2: instance.colorId1,
      },
    });

    // If the inverse similar color does not exist (including soft-deleted entries), create it
    if (!inverseSimilarColor) {
      inverseSimilarColor = await SimilarColor.create({
        colorId1: instance.colorId2,
        colorId2: instance.colorId1,
        creatorId: instance.creatorId, // You may want to adjust this based on your requirements
        approvalDate: instance.approvalDate,
      });
    } else if (inverseSimilarColor.deletedAt !== null) {
      // If the inverse similar color exists but is soft-deleted, restore it
      await inverseSimilarColor.restore();
      await inverseSimilarColor.update({
        approvalDate: instance.approvalDate,
      });
      await inverseSimilarColor.save();
    }
  }

  static async approveSimilarColorInversion(instance: SimilarColor) {
    // Check if both similar colors are approved
    let inverseSimilarColor = await SimilarColor.findOne({
      paranoid: false, // Include soft-deleted entries
      where: {
        colorId1: instance.colorId2,
        colorId2: instance.colorId1,
      },
    });

    // If the inverse similar color does not exist (including soft-deleted entries), create it
    if (inverseSimilarColor) {
      if (inverseSimilarColor.deletedAt !== null) {
        // If the inverse similar color exists but is soft-deleted, restore it
        await inverseSimilarColor.restore();
        await inverseSimilarColor.update({
          approvalDate: instance.approvalDate,
        });
        await inverseSimilarColor.save();
      } else {
        await inverseSimilarColor.update({
          approvalDate: instance.approvalDate,
        });
        await inverseSimilarColor.save();
      }
    } else {
      inverseSimilarColor = await SimilarColor.create({
        colorId1: instance.colorId2,
        colorId2: instance.colorId1,
        creatorId: instance.creatorId, // You may want to adjust this based on your requirements
        approvalDate: instance.approvalDate,
      });
    }
  }
}
