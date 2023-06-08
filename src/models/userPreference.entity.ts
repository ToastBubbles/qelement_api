import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DeletedAt,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table
export class UserPreference extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataTypes.ENUM('en', 'other'),
    defaultValue: 'en',
  })
  lang: string;

  @Column({ defaultValue: true })
  isCollectionVisible: boolean;

  @Column({ defaultValue: true })
  isWantedVisible: boolean;

  @Column({ defaultValue: true })
  allowMessages: boolean;

  @Column({
    type: DataTypes.ENUM('bl', 'tlg', 'bo'),
    defaultValue: 'bl',
  })
  prefName: string;

  @Column({
    type: DataTypes.ENUM('bl', 'tlg', 'bo', 'qe'),
    defaultValue: 'bl',
  })
  prefId: string;

  @DeletedAt
  deletedAt: Date;
}
