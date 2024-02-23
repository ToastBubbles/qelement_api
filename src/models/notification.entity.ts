import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table
export class Notification extends Model {
  @Column
  name: string;
  @Column
  type: string;
  @Column
  content: string;
  @Column
  read: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
