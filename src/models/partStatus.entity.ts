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
      'found',
      'seen',
      'known',
      'nightshift',
      'prototype',
      'employee',
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

  @Column
  location: string;

  @Column
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
}
