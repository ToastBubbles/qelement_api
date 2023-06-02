import { Table, Column, Model, HasOne, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';

@Table
export class Message extends Model {
  @Column
  subject: string;

  @Column
  content: string;

  @Column({ defaultValue: false })
  read: boolean;

  @ForeignKey(() => User)
  @Column
  recipientId: number;

  @HasOne(() => User)
  recipient: User;

  @ForeignKey(() => User)
  @Column
  senderId: number;

  @HasOne(() => User)
  sender: User;
}
