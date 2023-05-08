import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';

@Table
export class UserFavorite extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => QPart)
  @Column
  qpartId: number;
}
