import { Sequelize } from 'sequelize-typescript';
import dbConfig from '../config/config';
import Category from '../models/CategoryModel';
import Item from '../models/ItemsModel';
import Role from '../models/RoleModel';
import User from '../models/UserModel';
import Order from '../models/OrderModel';
import OrderDetails from '../models/OrderItemModel';

export default async function dbConnection() {
     const sequelize = new Sequelize({
      dialect: 'mysql',
      host: dbConfig.DatabaseDetails.dbhost,
      username: dbConfig.DatabaseDetails.dbusername,
      password: dbConfig.DatabaseDetails.dbpassword,
      database: dbConfig.DatabaseDetails.dbname,
      logging: false,
      models: [User, Role, Order, OrderDetails, Item, Category],
    });
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  return sequelize;
}

// const sequelize = new Sequelize({
//   dialect: 'mysql',
//   host: dbConfig.DatabaseDetails.dbhost,
//   port: dbConfig.DatabaseDetails.dbport,
//   username: dbConfig.DatabaseDetails.dbusername,
//   password: dbConfig.DatabaseDetails.dbpassword,
//   database: dbConfig.DatabaseDetails.dbname,
//   logging: false,
//   models: [User, Role, Order, OrderDetails, Item, Category],
// });
