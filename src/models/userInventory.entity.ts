import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';

@Table
export class UserInventory extends Model {
  @ForeignKey(() => QPart)
  @Column
  qpartId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  quantity: number;

  @Column
  condition: string;
}
