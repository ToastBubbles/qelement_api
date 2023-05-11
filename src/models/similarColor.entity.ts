import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  Unique,
  
} from 'sequelize-typescript';
import { Color } from './color.entity';

@Table
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
