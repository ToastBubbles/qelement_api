import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Color } from './color.entity';
import { Sculpture } from './sculpture.entity';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'SculptureColor',
  indexes: [{ fields: ['sculptureId', 'colorId'], unique: true }],
})
export class SculptureColor extends Model {
  @ForeignKey(() => Color)
  @Column({ unique: false })
  colorId: number;

  @BelongsTo(() => Color)
  color: Color;

  @ForeignKey(() => Sculpture)
  @Column({ unique: false })
  sculptureId: number;

  @BelongsTo(() => Sculpture)
  sculpture: Sculpture;

  @Column({ defaultValue: false })
  verified: boolean;
}
