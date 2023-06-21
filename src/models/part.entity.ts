import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DeletedAt,
  HasMany,
} from 'sequelize-typescript';
import { Category } from './category.entity';
import { PartMold } from './partMold.entity';
import { User } from './user.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Part extends Model {
  @Column({
    unique: true,
  })
  name: string;

  @Column
  note: string;

  @ForeignKey(() => Category)
  @Column
  CatId: number;

  @BelongsTo(() => Category)
  Category: Category;

  @HasMany(() => PartMold)
  molds: PartMold[];

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column
  approvalDate: Date;
}
