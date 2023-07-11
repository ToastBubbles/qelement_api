import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DeletedAt,
  AutoIncrement,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';

@Table({
  timestamps: true,
  paranoid: true,

  indexes: [{ fields: ['userId', 'qpartId', 'type'], unique: true }],
})
export class UserFavorite extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataTypes.ENUM('favorite', 'wanted', 'topfive', 'other'),
    defaultValue: 'favorite',
  })
  type: string;

  @ForeignKey(() => QPart)
  @Column({ unique: false })
  qpartId: number;

  @BelongsTo(() => QPart)
  qpart: QPart;

  @ForeignKey(() => User)
  @Column({ unique: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
