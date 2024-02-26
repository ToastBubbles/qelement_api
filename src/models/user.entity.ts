import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  HasMany,
  BelongsToMany,
  HasOne,
  ForeignKey,
  DeletedAt,
  Unique,
  BelongsTo,
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
import { UserTitle } from './userTitle.entity';
import { Title } from './title.entity';
import { UserGoal } from './userGoal.entity';
import { SecurityQuestion } from './securityQuestion.entity';
import { Color } from './color.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class User extends Model {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @Column({
    type: DataTypes.ENUM(
      'user',
      'trusted',
      'admin',
      'suspended',
      'banned',
      'other',
    ),
    defaultValue: 'user',
  })
  role: string;

  @Column
  suspentionDate: Date;

  @Column({
    type: DataTypes.STRING(1000),
  })
  suspentionReason: string;

  @ForeignKey(() => Title)
  @Column
  selectedTitleId: number;

  @Column
  patronLevel: number;

  @Column
  customTitle: string;

  @Column
  customColor: string;

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => Image)
  uploadedImages: Image[];

  @BelongsToMany(() => Title, () => UserTitle)
  titles: Title[];

  @HasMany(() => RaretyRating)
  ratings: RaretyRating[];

  @ForeignKey(() => Message)
  @Column
  sentMessageId: number;

  @HasMany(() => Message)
  recievedMessages: Message[];

  @ForeignKey(() => Message)
  @Column
  recievedMessageId: number;

  @HasMany(() => Message)
  sentMessages: Message[];

  @HasMany(() => PartStatus)
  partStatuses: PartStatus[];

  @HasOne(() => UserPreference)
  preferences: UserPreference;

  @BelongsToMany(() => QPart, {
    through: { model: () => UserFavorite, unique: false },
  })
  favoriteQParts: QPart[];

  @BelongsToMany(() => QPart, {
    through: { model: () => UserInventory, unique: false },
  })
  inventory: QPart[];

  @HasMany(() => UserGoal)
  goals: UserGoal[];

  @ForeignKey(() => Color)
  @Column
  favoriteColorId?: number;

  @BelongsTo(() => Color)
  favoriteColor?: Color;

  @HasMany(() => SecurityQuestion)
  securityQuestions: SecurityQuestion[];

  @HasOne(() => Image)
  profilePicture: Image;

  @ForeignKey(() => Image)
  @Column
  profilePictureId: number;


}
