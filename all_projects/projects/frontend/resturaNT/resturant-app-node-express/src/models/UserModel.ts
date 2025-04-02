/* eslint-disable */
import {
  Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany
} from 'sequelize-typescript';
import Role from './RoleModel';
import Order from './OrderModel';
@Table({
  timestamps: true,
  tableName: 'users',
})
export default class User extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @HasMany(() => Order)
  order: Order[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  roleId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  forgetPasswordToken!: string;
}
