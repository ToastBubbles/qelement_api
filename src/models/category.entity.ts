import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Subcategory } from './subcategory.entity';

@Table
export class Category extends Model {
  @Column
  name: string;

  @HasMany(() => Subcategory)
  subcategories: Subcategory[];
}
