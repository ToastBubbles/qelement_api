import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DeletedAt,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';
import { DataTypes, Sequelize } from 'sequelize';

@Table({
  timestamps: true,
  paranoid: true,
})
export class PartStatus extends Model {
  @Column({
    type: DataTypes.ENUM(
      'unknown',
      'idOnly',
      'seen',
      'found',
      'known',
      'other',
    ),
    defaultValue: 'unknown',
  })
  status: string;

  @Column({
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  })
  date: Date;

  @Column({ defaultValue: '' })
  location: string;

  @Column({ defaultValue: '' })
  note: string;

  @ForeignKey(() => QPart)
  @Column
  qpartId: number;

  @BelongsTo(() => QPart)
  qpart: QPart;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column
  approvalDate: Date;
}
