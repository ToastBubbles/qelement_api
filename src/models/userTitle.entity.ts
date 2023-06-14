import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';
import { Title } from './title.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class UserTitle extends Model {
  @ForeignKey(() => Title)
  @Column
  titleId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
