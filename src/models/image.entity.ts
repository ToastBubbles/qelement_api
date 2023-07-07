import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DeletedAt,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';
import { DataTypes } from 'sequelize';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Image extends Model {
  @Column
  path: string;

  @Column
  fileName: string;

  @Column({
    type: DataTypes.ENUM(
      'part',
      'sculpture',
      'suplemental',
      'damaged',
      'other',
    ),
    defaultValue: 'part',
  })
  type: string;

  @Column
  isPrimary: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  uploader: User;

  @ForeignKey(() => QPart)
  @Column
  qpartId: number;

  @BelongsTo(() => QPart)
  qpart: QPart;

  @Column
  approvalDate: Date;
}
