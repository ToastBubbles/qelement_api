import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Category } from './category.entity';

@Table
export class Part extends Model {
  @Column
  name: string;

  @Column
  number: string;

  @ForeignKey(() => Category)
  @Column
  CatId: number;

  @BelongsTo(() => Category)
  Category: Category;
}
