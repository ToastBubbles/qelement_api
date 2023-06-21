import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Part } from './part.entity';
import { User } from './user.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class PartMold extends Model {
  @Column({
    unique: true,
  })
  number: string;

  @Column
  note: string;

  @ForeignKey(() => Part)
  @Column
  parentPartId: number;
  @BelongsTo(() => Part)
  parentPart: Part;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;
  @Column
  approvalDate: Date;
}
