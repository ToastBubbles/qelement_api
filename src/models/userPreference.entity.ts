import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
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
  @Column
  lang: string;

  @Column({ defaultValue: true })
  isCollectionVisible: boolean;
  @Column({
    type: DataTypes.ENUM('bl', 'tlg', 'bo'),
    defaultValue: 'bl',
  })
  @Column
  prefName: string;
  @Column({
    type: DataTypes.ENUM('bl', 'tlg', 'bo'),
    defaultValue: 'bl',
  })
  @Column
  prefId: string;
}
