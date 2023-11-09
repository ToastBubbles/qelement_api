import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { PredefinedSecurityQuestion } from './predefinedSecurityQuestion.entity';

@Table
export class SecurityQuestion extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => PredefinedSecurityQuestion)
  @Column
  predefinedQuestionId: number;

  @BelongsTo(() => PredefinedSecurityQuestion)
  predefinedQuestion: PredefinedSecurityQuestion;

  @Column
  answer: string;
}
