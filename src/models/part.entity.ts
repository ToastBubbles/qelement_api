import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DeletedAt,
} from 'sequelize-typescript';
import { Category } from './category.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Part extends Model {
  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
  })
  number: string;

  @Column
  secondaryNumber: string;

  @Column
  note: string;

  @ForeignKey(() => Category)
  @Column
  CatId: number;

  @BelongsTo(() => Category)
  Category: Category;
}
