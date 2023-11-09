import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class ElementID extends Model {
  @Column({ unique: true })
  number: number;

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

  @Column
  approvalDate: Date;
}