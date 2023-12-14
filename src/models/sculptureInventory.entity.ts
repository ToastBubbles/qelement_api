import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { Sculpture } from './sculpture.entity';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'SculptureInventory',
  indexes: [{ fields: ['sculptureId', 'qpartId'], unique: true }],
})
export class SculptureInventory extends Model {
  @ForeignKey(() => QPart)
  @Column({ unique: false })
  qpartId: number;

  @BelongsTo(() => QPart)
  qpart: QPart;

  @ForeignKey(() => Sculpture)
  @Column({ unique: false })
  sculptureId: number;

  @BelongsTo(() => Sculpture)
  sculpture: Sculpture;

  @Column({ defaultValue: false })
  verified: boolean;
}
