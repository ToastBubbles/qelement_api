import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DeletedAt,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';
import { DataTypes } from 'sequelize';
import { Sculpture } from './sculpture.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Comment extends Model {
  @Column({
    type: DataTypes.STRING(1000),
  })
  content: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({ defaultValue: false })
  edited: boolean;

  @ForeignKey(() => QPart)
  @Column
  qpartId?: number;

  @BelongsTo(() => QPart)
  qpart?: QPart;

  @ForeignKey(() => Sculpture)
  @Column
  sculptureId?: number;

  @BelongsTo(() => Sculpture)
  sculpture?: Sculpture;

  @BelongsTo(() => User)
  creator: User;
}
