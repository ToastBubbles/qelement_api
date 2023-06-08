import { DataTypes, Sequelize } from 'sequelize';
import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  createIndexDecorator,
  DeletedAt,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';

@Table({
  indexes: [{ fields: ['creatorId', 'qpartId'], unique: true }],
})
export class RaretyRating extends Model {
  // @Column({
  //   type: DataTypes.ENUM('user', 'admin', 'banned', 'other'),
  //   defaultValue: 'user',
  // })

  @Column({
    // type: DataTypes.INTEGER(100)
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  })
  rating: number;

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

  @DeletedAt
  deletedAt: Date;
}
