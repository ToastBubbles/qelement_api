import {
  Table,
  Column,
  Model,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { UserTitle } from './userTitle.entity';
import { DataTypes } from 'sequelize';

@Table
export class Title extends Model {
  @Column
  title: string;

  @Column
  cssClasses: string;

  @BelongsToMany(() => User, () => UserTitle)
  users: User[];

  @Column({ defaultValue: true })
  public: boolean;

  @Column({ type: DataTypes.STRING(255) })
  requirement: string;
}
