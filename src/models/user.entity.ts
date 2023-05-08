import {
  Table,
  Column,
  Model,
  HasMany,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { Comment } from './comment.entity';
import { Image } from './image.entity';
import { Message } from './message.entity';
import { PartStatus } from './partStatus.entity';
import { QPart } from './qPart.entity';
import { RaretyRating } from './raretyRating.entity';
import { UserFavorite } from './userFavorite.entity';
import { UserInventory } from './userInventory.entity';
import { UserPreference } from './userPreference.entity';

@Table
export class User extends Model {
  @Column
  name: string;

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => Image)
  uploadedImages: Image[];

  @HasMany(() => RaretyRating)
  ratings: RaretyRating[];

  @HasMany(() => Message)
  recievedMessages: Message[];

  @HasMany(() => Message)
  sentMessages: Message[];

  @HasMany(() => PartStatus)
  partStatuses: PartStatus[];

  @HasOne(() => UserPreference)
  preferences: UserPreference;

  @BelongsToMany(() => QPart, () => UserFavorite)
  favoriteQParts: QPart[];

  @BelongsToMany(() => QPart, () => UserInventory)
  inventory: QPart[];
}
