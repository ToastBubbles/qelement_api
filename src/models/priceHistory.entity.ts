import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class PriceHistory extends Model {
  @Column
  price: number;
}
