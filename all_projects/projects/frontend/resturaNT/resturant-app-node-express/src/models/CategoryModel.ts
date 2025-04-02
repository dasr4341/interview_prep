import {
  Table, Model, Column, DataType, HasMany
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import Item from './ItemsModel';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  tableName: 'categories'
})
export default class Category extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  status!: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parent_id!: number;

  @HasMany(() => Category, 'parent_id')
  subcategory: Category[];

  @HasMany(() => Item, {
    onDelete: 'CASCADE',
    hooks: true
  })
  item: Item[];
}
