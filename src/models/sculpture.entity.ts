import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  BelongsToMany,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { SculptureInventory } from './sculptureInventory.entity';
import { Image } from './image.entity';

import { User } from './user.entity';
import { Comment } from './comment.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Sculpture extends Model {
  @Column({ unique: true })
  name: string;

  @Column({
    type: DataTypes.ENUM('system', 'technic', 'duplo', 'hybrid', 'other'),
    defaultValue: 'system',
  })
  brickSystem: string;

  @Column({ type: DataTypes.STRING(50) })
  location: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true, // Now it's optional
    validate: {
      isInt: {
        msg: 'Year must be an integer.',
      },
      min: {
        args: [1932], // Minimum year, adjust as needed
        msg: 'Year must be a valid year.',
      },
      max: {
        args: [2500], // Maximum year, adjust as needed
        msg: 'Year must be a valid year.',
      },
    },
  })
  yearMade!: number | null; // Adjust the type to allow null

  @Column({
    type: DataType.INTEGER,
    allowNull: true, // Now it's optional
    validate: {
      isInt: {
        msg: 'Year must be an integer.',
      },
      min: {
        args: [1932], // Minimum year, adjust as needed
        msg: 'Year must be a valid year.',
      },
      max: {
        args: [2500], // Maximum year, adjust as needed
        msg: 'Year must be a valid year.',
      },
    },
  })
  yearRetired!: number | null; // Adjust the type to allow null

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => Image)
  images: Image[];

  @Column({
    type: DataTypes.STRING(255),
  })
  keywords: string;

  @Column({ defaultValue: '', type: DataTypes.STRING(255) })
  note: string;

  @BelongsToMany(() => QPart, {
    through: { model: () => SculptureInventory, unique: false },
  })
  inventory: QPart[];

  // @BelongsToMany(() => Color, {
  //   through: { model: () => SculptureColor, unique: false },
  // })
  // colors: Color[];

  @HasMany(() => Comment)
  comments: Comment[];

  @Column
  approvalDate: Date;
}
