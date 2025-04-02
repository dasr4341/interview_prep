/* eslint-disable */
import {
  Table, Model, Column, DataType, HasMany
} from 'sequelize-typescript';
import User from './UserModel';

@Table({
  timestamps: false,
  tableName: 'roles',
})
export default class Role extends Model {
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

  @HasMany(() => User)
  user: User[];
}
