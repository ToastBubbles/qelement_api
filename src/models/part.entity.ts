import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DeletedAt,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Category } from './category.entity';
import { PartMold } from './partMold.entity';
import { User } from './user.entity';
import { UserGoal } from './userGoal.entity';

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

  @Column
  blURL: string;

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

  @HasMany(() => UserGoal)
  goals: UserGoal[];

  @Column
  approvalDate: Date;
}
