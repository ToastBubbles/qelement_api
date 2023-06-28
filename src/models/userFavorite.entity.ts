import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DeletedAt,
  AutoIncrement,
  PrimaryKey,
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

  @ForeignKey(() => User)
  @Column({ unique: false })
  userId: number;

  @ForeignKey(() => QPart)
  @Column({ unique: false })
  qpartId: number;
}
