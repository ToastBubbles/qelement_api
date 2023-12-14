import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  BelongsToMany,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { SculptureInventory } from './sculptureInventory.entity';
import { Image } from './image.entity';
import { Color } from './color.entity';
import { SculptureColor } from './sculptureColor.entity';

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

  @Column
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

  @HasMany(() => Image)
  images: Image[];

  @Column({
    type: DataTypes.STRING(255),
  })
  keywords: string;

  @BelongsToMany(() => QPart, {
    through: { model: () => SculptureInventory, unique: false },
  })
  inventory: QPart[];

  @BelongsToMany(() => Color, {
    through: { model: () => SculptureColor, unique: false },
  })
  colors: Color[];
}
