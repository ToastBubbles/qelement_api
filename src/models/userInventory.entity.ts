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

@Table({
  timestamps: true,
  paranoid: true,
})
export class UserInventory extends Model {
  @Column({
    defaultValue: false,
  })
  forTrade: boolean;

  @Column({
    defaultValue: false,
  })
  forSale: boolean;

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
