import {
  Table,
  Column,
  Model,
  HasMany,
  DeletedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { Part } from './part.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Category extends Model {
  @Column({
    unique: true,
  })
  name: string;

  @HasMany(() => Part)
  parts: Part[];

  @Column
  approvalDate: Date;
}
