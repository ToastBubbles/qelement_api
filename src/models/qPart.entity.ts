import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  BelongsToMany,
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

@Table
export class QPart extends Model {
  @Column
  isKnown: string;

  @ForeignKey(() => Part)
  @Column
  partId: number;

  @BelongsTo(() => Part)
  part: Part;

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

  @HasOne(() => Image)
  image: Image;

  @HasMany(() => RaretyRating)
  ratings: RaretyRating[];

  @BelongsToMany(() => User, () => UserFavorite)
  userFAvorites: User[];

  @BelongsToMany(() => User, () => UserInventory)
  userInventories: User[];
}
