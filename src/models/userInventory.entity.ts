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
  tableName: 'UserInventory',
  indexes: [
    { fields: ['userId', 'qpartId', 'condition', 'material'], unique: true },
  ],
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

  @Column({
    defaultValue: false,
  })
  availDuplicates: boolean;

  @Column({
    type: DataTypes.STRING(15),
    allowNull: true,
  })
  material: string | null;

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
