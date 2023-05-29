import { Table, Column, Model, HasMany, DeletedAt } from 'sequelize-typescript';
import { Part } from './part.entity';

@Table
export class Category extends Model {
  @Column({
    unique: true,
  })
  name: string;

  @DeletedAt
  deletionDate: Date;

  @HasMany(() => Part)
  parts: Part[];
}
