import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DeletedAt,
  BeforeSave,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';
import { DataTypes } from 'sequelize';
import { Sculpture } from './sculpture.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Image extends Model {
  @Column
  path: string;

  @Column
  fileName: string;

  @Column({
    type: DataTypes.ENUM(
      'part',
      'supplemental',
      'sculpture',
      'damaged',
      'other',
    ),
    defaultValue: 'part',
  })
  type: string;

  @Column({ defaultValue: false })
  isPrimary: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  uploader: User;

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

  @Column
  approvalDate: Date;
}
