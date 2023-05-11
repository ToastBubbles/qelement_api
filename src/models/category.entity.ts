import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Part } from './part.entity';

@Table
export class Category extends Model {
  @Column
  name: string;

  @HasMany(() => Part)
  parts: Part[];
}
