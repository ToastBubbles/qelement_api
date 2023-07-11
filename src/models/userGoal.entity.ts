import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Part } from './part.entity';
import { PartMold } from './partMold.entity';
import { DataTypes } from 'sequelize';

@Table({
  timestamps: true,
  paranoid: true,
  //   indexes: [{ fields: ['id'], unique: true }],
})
export class UserGoal extends Model {
  // @PrimaryKey
  // @AutoIncrement
  // @Column
  // id: number;

  //   @ForeignKey(() => Part)
  //   @Column({ unique: false })
  //   partId: number;

  //   @BelongsTo(() => Part, 'partId')
  //   part: Part;

  //   @ForeignKey(() => PartMold)
  //   @Column({ unique: false, defaultValue: null })
  //   moldId: number;

  //   @BelongsTo(() => PartMold, 'moldId')
  //   mold: PartMold;

  //   @ForeignKey(() => User)
  //   @Column({ unique: false })
  //   userId: number;

  //   @BelongsTo(() => User, 'userId')
  //   user: User;

  // @ForeignKey(() => Part)
  // @Column({ unique: false })
  // partId: number;

  // @ForeignKey(() => PartMold)
  // @Column({ unique: false, defaultValue: null })
  // moldId: number;

  // @ForeignKey(() => User)
  // @Column({ unique: false })
  // userId: number;

  // @BelongsTo(() => User)
  // user: User;

  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Part)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  partId!: number;

  @ForeignKey(() => PartMold)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
  })
  partMoldId?: number;

  // ...

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Part)
  part!: Part;

  @BelongsTo(() => PartMold)
  partMold?: PartMold;
  
  @Column
  includeSolid: boolean;
  @Column
  includeTrans: boolean;
  @Column
  includeOther: boolean;
  @Column
  includeKnown: boolean;
}
