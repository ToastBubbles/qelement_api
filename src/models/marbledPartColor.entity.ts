import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { MarbledPart } from './marbledPart.entity';
import { Color } from './color.entity';


@Table
export class MarbledPartColor extends Model {
  @ForeignKey(() => MarbledPart)
  @Column({
    type: DataTypes.INTEGER,
  })
  marbledPartId: number;

  @BelongsTo(() => MarbledPart)
  marbledPart: MarbledPart;

  @ForeignKey(() => Color)
  @Column({
    type: DataTypes.INTEGER,
  })
  colorId: number;

  @BelongsTo(() => Color)
  color: Color;

  @Column
  percent: number


}
