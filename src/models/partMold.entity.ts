import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Part } from './part.entity';
import { User } from './user.entity';
import { UserGoal } from './userGoal.entity';
import { QPart } from './qPart.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class PartMold extends Model {
  @Column({
    unique: true,
  })
  number: string;

  @Column
  note: string;

  @ForeignKey(() => Part)
  @Column
  parentPartId: number;
  @BelongsTo(() => Part)
  parentPart: Part;

  @HasMany(() => UserGoal)
  goals: UserGoal[];

  @HasMany(() => QPart)
  qparts: QPart[];

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;
  @Column
  approvalDate: Date;

  static async findByParentPartID(partId: number): Promise<PartMold[]> {
    return this.findAll<PartMold>({
      where: { parentPartId: partId },
    });
  }
}
