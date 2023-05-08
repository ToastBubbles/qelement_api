
    import { Table, Column, Model } from 'sequelize-typescript';

    @Table
    export class KnownColor extends Model {
    @Column
    name: string;

    }
    