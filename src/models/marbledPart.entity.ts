import {
  Table,
  Column,
  Model,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { MarbledPartColor } from './marbledPartColor.entity';
import { PartMold } from './partMold.entity';
import { DataTypes } from 'sequelize';
import { Image } from './image.entity';
import { User } from './user.entity';

@Table
export class MarbledPart extends Model {
  @ForeignKey(() => PartMold)
  @Column({
    type: DataTypes.INTEGER,
  })
  moldId: number;

  @BelongsTo(() => PartMold)
  mold: PartMold;

  @HasMany(() => MarbledPartColor)
  colors: MarbledPartColor[];

  @HasMany(() => Image)
  images: Image[];

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column({ defaultValue: '', type: DataTypes.STRING(255) })
  note: string;

  @Column
  approvalDate: Date;
}
