import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Status extends Model {
  @Column
  name: string;
}
