import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Category } from './category.entity';
import { Part } from './part.entity';

@Table
export class Subcategory extends Model {
  @Column
  name: string;

  @ForeignKey(() => Category)
  @Column
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => Part)
  parts: Part[];
}
