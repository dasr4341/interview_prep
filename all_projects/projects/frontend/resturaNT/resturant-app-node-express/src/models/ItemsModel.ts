/* eslint-disable import/no-cycle */
import {
  Table, Model, Column, DataType, BelongsTo, ForeignKey, HasMany
} from 'sequelize-typescript';

// eslint-disable-next-line import/no-cycle
import Category from './CategoryModel';
import OrderItems from './OrderItemModel';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  tableName: 'items',
})
export default class Item extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  img!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  status!: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  item_limit!: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  subcategory_id!: number;

  @HasMany(() => OrderItems)
  items: OrderItems[];
}
