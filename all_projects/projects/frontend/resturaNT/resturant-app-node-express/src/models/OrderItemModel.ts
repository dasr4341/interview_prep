import {
  Table, Model, Column, DataType, ForeignKey, BelongsTo
} from 'sequelize-typescript';

// eslint-disable-next-line import/no-cycle
import Order from './OrderModel';
// eslint-disable-next-line import/no-cycle
import Item from './ItemsModel';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  tableName: 'OrderItems',
})
export default class OrderItems extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  item_price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  no_of_items!: string;

  @BelongsTo(() => Order)
  order: Order;

  @ForeignKey(() => Order)
  @Column
  order_id!: number;

  @BelongsTo(() => Item)
  item: Item;

  @ForeignKey(() => Item)
  @Column
  item_id!: number;

  left_over: any;
}
