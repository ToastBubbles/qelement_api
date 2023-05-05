import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Color extends Model {
  @Column
  bl_name: string;
  @Column
  tlg_name: string;
  @Column
  bo_name: string;
  @Column
  hex: string;
}
