import {
  Table,
  Column,
  Model,
  HasMany,
  Length,
  BelongsToMany,
  DeletedAt,
} from 'sequelize-typescript';
import { SimilarColor } from './similarColor.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Color extends Model {
  @Column
  bl_name: string;
  @Column
  tlg_name: string;
  @Column
  bo_id: number;
  @Column
  bo_name: string;
  @Length({ min: 6, max: 6 })
  @Column({ defaultValue: '000000' })
  hex: string;
  @Column
  bl_id: number;
  @Column
  tlg_id: number;
  @Column
  type: string;
  @Column
  note: string;

  @BelongsToMany(() => Color, () => SimilarColor, 'colorId1', 'colorId2')
  similar: Color[];

  // @HasMany(() => Color)
  // similarColors: Color[];
}
