import {
  Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany
} from 'sequelize-typescript';

// eslint-disable-next-line import/no-cycle
import User from './UserModel';
// eslint-disable-next-line import/no-cycle
import OrderItems from './OrderItemModel';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  tableName: 'Orders',
})
export default class Order extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @HasMany(() => OrderItems)
  orderItems: OrderItems[];

  @Column({
    type: DataType.ENUM('pending', 'confirmed', 'ready', 'delivered'),
    allowNull: true,
  })
  status!: string;
}
