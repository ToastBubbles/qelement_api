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
    defaultValue: 'unknown',
  })
  type: string;

  @Column
  note: string;

  @Column
  elementId: string;

  @ForeignKey(() => PartMold)
  @Column
  moldId: number;

  @BelongsTo(() => PartMold)
  mold: PartMold;

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

  @Column
  approvalDate: Date;
}
