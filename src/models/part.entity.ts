import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Subcategory } from './subcategory.entity';

@Table
export class Part extends Model {
  @Column
  name: string;

  @Column
  number: string;

  @ForeignKey(() => Subcategory)
  @Column
  subCatId: number;

  @BelongsTo(() => Subcategory)
  subCategory: Subcategory;
}
