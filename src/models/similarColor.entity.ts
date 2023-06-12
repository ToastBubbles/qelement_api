import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  Unique,
  DeletedAt,
} from 'sequelize-typescript';
import { Color } from './color.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class SimilarColor extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Color)
  @Column
  colorId1: number;

  @ForeignKey(() => Color)
  @Column
  colorId2: number;
}
