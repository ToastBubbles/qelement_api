import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  timestamps: false, // Set timestamps option to false
})
export class PredefinedSecurityQuestion extends Model {
  @Column
  question: string;
}
