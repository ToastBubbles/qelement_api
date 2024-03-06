import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { QPart } from './qPart.entity';
import { User } from './user.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class ElementID extends Model {
  @Column({ unique: true })
  number: number;

  @ForeignKey(() => QPart)
  @Column
  qpartId: number;
  @BelongsTo(() => QPart)
  qpart: QPart;

  @ForeignKey(() => User)
  @Column
  creatorId: number;
  @BelongsTo(() => User)
  creator: User;

  @Column
  approvalDate: Date;
  
  static async findByCreatorId(creatorId: number): Promise<ElementID[]> {
    return this.findAll<ElementID>({
      where: { creatorId },
    });
  }

  
}
