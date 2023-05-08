import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';

@Table
export class RaretyRating extends Model {
  @Column
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
}
