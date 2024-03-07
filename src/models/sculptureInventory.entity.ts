import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { Sculpture } from './sculpture.entity';
import { User } from './user.entity';
import { SubmissionCount } from './submissionCount.entity';
import { Op } from 'sequelize';
import { Color } from './color.entity';
import { ElementID } from './elementID.entity';
import { Part } from './part.entity';
import { PartMold } from './partMold.entity';
import { PartStatus } from './partStatus.entity';
import { RaretyRating } from './raretyRating.entity';
import { Image } from './image.entity';

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
      include: [
        {
          model: QPart,
          include: [
            {
              model: ElementID,
              where: {
                approvalDate: {
                  [Op.ne]: null,
                },
              },
              required: false,
            },
            { model: PartMold, include: [Part] },
            Color,
            { model: User, as: 'creator' },
            RaretyRating,
            {
              model: PartStatus,
              where: {
                approvalDate: {
                  [Op.ne]: null,
                },
              },
              required: false,
            },

            {
              model: Image,
              include: [{ model: User, as: 'uploader' }],
            },
          ],
        },
        User,
        {
          model: Sculpture,
          include: [Image],
        },
      ],
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
    const previousApprovalDate = instance.previous('approvalDate');
    const currentApprovalDate = instance.approvalDate;

    if (previousApprovalDate === null && currentApprovalDate !== null) {
      await SubmissionCount.increaseApproved(instance.creatorId, true);
    }
  }

  @AfterDestroy
  static async deleteAssociatedModels(instance: SculptureInventory) {
    const previousApprovalDate = instance.previous('approvalDate');
    if (previousApprovalDate === null) {
      await SubmissionCount.decreasePending(instance.creatorId);
    }
  }
}
