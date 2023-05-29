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

@Table
export class Comment extends Model {
  @Column
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

  @DeletedAt
  deletionDate: Date;
}
