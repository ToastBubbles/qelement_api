import {
  Table,
  Column,
  Model,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { UserTitle } from './userTitle.entity';

@Table
export class Title extends Model {
  @Column
  title: string;

  @BelongsToMany(() => User, () => UserTitle)
  users: User[];
}
