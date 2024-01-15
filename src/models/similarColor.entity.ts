import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  Unique,
  DeletedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Color } from './color.entity';
import { User } from './user.entity';

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

  @BelongsTo(() => Color, { foreignKey: 'colorId1', as: 'color1' })
  color1: Color;

  @ForeignKey(() => Color)
  @Column
  colorId2: number;

  @BelongsTo(() => Color, { foreignKey: 'colorId2', as: 'color2' })
  color2: Color;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column
  approvalDate: Date;
}
