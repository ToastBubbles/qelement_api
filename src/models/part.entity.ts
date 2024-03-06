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
import { Comment } from './comment.entity';

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
  catId: number;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => PartMold)
  molds: PartMold[];

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => UserGoal)
  goals: UserGoal[];

  @HasMany(() => Comment)
  comments: Comment[];

  @Column
  approvalDate: Date;

  
  static async findByCreatorId(creatorId: number): Promise<Part[]> {
    return this.findAll<Part>({
      where: { creatorId },
    });
  }

  
}
