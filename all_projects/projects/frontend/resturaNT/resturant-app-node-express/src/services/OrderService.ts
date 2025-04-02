import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import Order from '../models/OrderModel';
import OrderItems from '../models/OrderItemModel';
import UserService from './UserService';
import HttpError from '../error/HttpError';
import { OrderStatus } from '../config/config';
import Item from '../models/ItemsModel';
import Category from '../models/CategoryModel';
import User from '../models/UserModel';

export default class OrderService {
  getAllOrder = async () => {
    try {
      return await Order.findAll({
        include: [
          {
            model: OrderItems,
            attributes: ['id', 'item_price', 'no_of_items', 'order_id'],
            include: [
              {
                model: Item,
                attributes: ['id', 'name', 'img', 'item_limit'],
                include: [{ model: Category, attributes: ['name'] }],
              },
            ],
          },
        ],
        order: [['id', 'DESC']],
      });
    } catch (err) {
      throw new HttpError("Couldn't get Orders", StatusCodes.INTERNAL_SERVER_ERROR, err);
    }
  };

  getOrderByStatus = async (status: string) => {
    try {
      return await Order.findAll({
        include: [
          {
            model: OrderItems,
            attributes: ['id', 'item_price', 'no_of_items', 'order_id'],
            include: [
              {
                model: Item,
                attributes: ['id', 'name', 'img', 'item_limit'],
                include: [{ model: Category, attributes: ['name'] }],
              },
            ],
          },
          {
            model: User,
            attributes: ['name', 'email', 'phone', 'address']
          }
        ],
        order: [['id', 'DESC']],
        where: {
          status: {
            [Op.startsWith]: status,
          },
        },
      });
    } catch (err) {
      throw new HttpError("Couldn't get Orders", StatusCodes.INTERNAL_SERVER_ERROR, err);
    }
  };

  addOrder = async (order: any, orderItemsS: any) => {
    // check the user exist or not
    const userId = order.user_id;
    const UserServiceObj = new UserService();
    const findUserById = await UserServiceObj.findOneUserByPk(userId);
    if (findUserById) {
      // user exist
      try {
        return await Order.create(
          { ...order, ...{ status: OrderStatus.PENDING }, orderItems: orderItemsS },
          {
            include: { model: OrderItems },
          }
        );
      } catch (err) {
        throw new HttpError('Failed to add order ', StatusCodes.INTERNAL_SERVER_ERROR, err);
      }
    } else {
      throw new HttpError('User not found ! ', StatusCodes.BAD_REQUEST, userId);
    }
  };

  getOrderById = async (id: any) => {
    try {
      return await Order.findByPk(id, {
        include: [
          {
            model: OrderItems,
            attributes: ['id', 'item_price', 'no_of_items', 'order_id'],
            include: [
              {
                model: Item,
                attributes: ['id', 'name', 'img', 'item_limit'],
                include: [{ model: Category, attributes: ['name'] }],
              },
            ],
          },
          {
            model: User,
            attributes: ['name', 'email', 'phone', 'address']
          }
        ],
        order: [['id', 'DESC']],
      });
    } catch (err) {
      throw new HttpError('Failed to get Order details', StatusCodes.INTERNAL_SERVER_ERROR, err);
    }
  };

  updateOrder = async (id: any, OrderUpdate: any) => {
    // first check the order exist or not
    const checkOrderIsValid = await this.getOrderById(id);
    if (checkOrderIsValid) {
      // order valid
      try {
        await Order.update({ ...OrderUpdate }, { where: { id } });
        return await this.getOrderById(id);
      } catch (err) {
        throw new Error('Failed to update Order details');
      }
    } else {
      throw new HttpError('Order not found', StatusCodes.BAD_REQUEST, id);
    }
  };

  updateOrderStatus = async (id: any, status: any) => {
    const checkOrderIsValid = await this.getOrderById(id);
    if (checkOrderIsValid) {
      try {
        return await Order.update({ ...status }, { where: { id } });
      } catch (err) {
        throw new HttpError('Failed to update Order details', StatusCodes.INTERNAL_SERVER_ERROR, err);
      }
    } else {
      throw new HttpError('Order not found', StatusCodes.BAD_REQUEST, id);
    }
  };

  deleteOrder = async (id: any) => {
    const checkOrderIsValid = await this.getOrderById(id);
    if (checkOrderIsValid) {
      try {
        return await Order.destroy({ where: { id } });
      } catch (err) {
        throw new HttpError('Failed to update Order details', StatusCodes.INTERNAL_SERVER_ERROR, err);
      }
    } else {
      throw new HttpError('Order not found', StatusCodes.BAD_REQUEST, id);
    }
  };
}
