import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Part extends Model {
  @Column
  name: string;

  @Column
  number: string;
}
