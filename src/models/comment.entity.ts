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
import { DataTypes } from 'sequelize';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Comment extends Model {
  @Column({
    type: DataTypes.STRING(1000),
  })
  content: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => QPart)
  @Column
  qpartId: number;

  @BelongsTo(() => User)
  creator: User;

  @BelongsTo(() => QPart)
  qpart: QPart;
}
