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
  tableName: 'UserInventory',
  indexes: [{ fields: ['userId', 'qpartId', 'condition'], unique: true }],
})
export class UserInventory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    defaultValue: false,
  })
  forTrade: boolean;

  @Column({
    defaultValue: false,
  })
  forSale: boolean;

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

  @Column
  quantity: number;

  @Column({
    type: DataTypes.ENUM('damaged', 'used', 'new'),
    defaultValue: 'used',
  })
  condition: string;

  @Column
  note: string;
}
