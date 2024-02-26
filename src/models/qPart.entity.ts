import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  BelongsToMany,
  DeletedAt,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeSave,
  AfterDestroy,
} from 'sequelize-typescript';
import { Color } from './color.entity';
import { Comment } from './comment.entity';
import { Image } from './image.entity';
import { Part } from './part.entity';
import { PartStatus } from './partStatus.entity';
import { RaretyRating } from './raretyRating.entity';
import { User } from './user.entity';
import { UserFavorite } from './userFavorite.entity';
import { UserInventory } from './userInventory.entity';
import { PartMold } from './partMold.entity';
import { DataTypes } from 'sequelize';
import { ElementID } from './elementID.entity';
import { Sculpture } from './sculpture.entity';
import { SculptureInventory } from './sculptureInventory.entity';
@Table({
  timestamps: true,
  paranoid: true,
})
export class QPart extends Model {
  @Column({
    type: DataTypes.ENUM(
      'qelement',
      'nightshift',
      'prototype',
      'test',
      'employee',
      'other',
      'unknown',
    ),
    defaultValue: 'other',
  })
  type: string;

  @Column({ defaultValue: '', type: DataTypes.STRING(255) })
  note: string;

  @ForeignKey(() => PartMold)
  @Column
  moldId: number;

  @BelongsTo(() => PartMold)
  mold: PartMold;

  @Column({ defaultValue: false })
  isMoldUnknown: boolean;

  @ForeignKey(() => Color)
  @Column
  colorId: number;

  @BelongsTo(() => Color)
  color: Color;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => PartStatus)
  partStatuses: PartStatus[];

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => ElementID)
  elementIDs: ElementID[];

  @HasMany(() => Image)
  images: Image[];

  @HasMany(() => RaretyRating)
  ratings: RaretyRating[];

  @BelongsToMany(() => User, {
    through: { model: () => UserFavorite, unique: false },
  })
  userFavorites: User[];

  @BelongsToMany(() => User, {
    through: { model: () => UserInventory, unique: false },
  })
  userInventories: User[];

  @BelongsToMany(() => Sculpture, {
    through: { model: () => SculptureInventory, unique: false },
  })
  sculptureInventories: Sculpture[];

  @Column
  approvalDate: Date;

  static async findByMoldId(moldId: number): Promise<QPart[]> {
    return this.findAll<QPart>({
      where: { moldId },
    });
  }

  @AfterDestroy
  static async deleteAssociatedModels(instance: QPart) {
    // Delete associated ElementIDs for the destroyed QPart
    await ElementID.destroy({
      where: {
        qpartId: instance.id, // Assuming there's a qpartId foreign key in the ElementID model
      },
    });

    // Delete associated Comments for the destroyed QPart
    await Comment.destroy({
      where: {
        qpartId: instance.id, // Assuming there's a qpartId foreign key in the Comment model
      },
    });
    // Delete associated Comments for the destroyed QPart
    await UserInventory.destroy({
      where: {
        qpartId: instance.id, // Assuming there's a qpartId foreign key in the Comment model
      },
    });
    // Delete associated Comments for the destroyed QPart
    await UserFavorite.destroy({
      where: {
        qpartId: instance.id, // Assuming there's a qpartId foreign key in the Comment model
      },
    });
    // Delete associated Comments for the destroyed QPart
    await SculptureInventory.destroy({
      where: {
        qpartId: instance.id, // Assuming there's a qpartId foreign key in the Comment model
      },
    });

    // Delete associated Comments for the destroyed QPart
    await RaretyRating.destroy({
      where: {
        qpartId: instance.id, // Assuming there's a qpartId foreign key in the Comment model
      },
    });
    // Delete associated Comments for the destroyed QPart
    await PartStatus.destroy({
      where: {
        qpartId: instance.id, // Assuming there's a qpartId foreign key in the Comment model
      },
    });
    // Delete associated Comments for the destroyed QPart
    await Image.destroy({
      where: {
        qpartId: instance.id, // Assuming there's a qpartId foreign key in the Comment model
      },
    });
  }
}
