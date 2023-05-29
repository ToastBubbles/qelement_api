import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DeletedAt,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';

@Table
export class UserFavorite extends Model {
  @Column({
    type: DataTypes.ENUM('favorite', 'wanted', 'topfive', 'other'),
    defaultValue: 'favorite',
  })
  type: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => QPart)
  @Column
  qpartId: number;

  @DeletedAt
  deletionDate: Date;
}
