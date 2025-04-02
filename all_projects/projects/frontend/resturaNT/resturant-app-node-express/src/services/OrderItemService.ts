import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import moment from 'moment';
import HttpError from '../error/HttpError';
import OrderItems from '../models/OrderItemModel';
import dbConnection from '../db/connection';

export default class OrderItemsService {
  getAllOrderItems = async () => {
    try {
      // { include: [Order, Item] }
      return await OrderItems.findAll({
        order: [['id', 'DESC']]
      });
    } catch (err) {
      console.log(err);
      throw new Error('Failed to get OrderItems ');
    }
  };

  addOrderItems = async (order: any) => {
    try {
      return await OrderItems.bulkCreate(order);
    } catch (err) {
      throw new HttpError('Failed to add OrderItems', StatusCodes.INTERNAL_SERVER_ERROR, err);
    }
  };

  getOrderItems = async (id: any) => {
    try {
      return await OrderItems.findByPk(id);
    } catch (err) {
      throw new HttpError('Failed to get OrderItems', StatusCodes.INTERNAL_SERVER_ERROR, err);
    }
  };

  getOrderItemsByOrderId = async (order_id: any) => {
    try {
      return await OrderItems.findAll({ where: { order_id } });
    } catch (err) {
      throw new Error('Failed to get OrderItems ');
    }
  };

  updateOrderItems = async (id: any, OrderItemsUpdate: any) => {
    try {
      await OrderItems.update({ ...OrderItemsUpdate }, { where: { id } });
    } catch (err) {
      throw new Error('Failed to update OrderItems ');
    }
    return this.getOrderItems(id);
  };

  updateNoOfOrderItems = async (id: any, data: any) => {
    // check is the orderItems exist in db
    let response;
    try {
      response = await this.getOrderItems(id);
    } catch (err) {
      throw new HttpError('Failed to update OrderItems ', StatusCodes.INTERNAL_SERVER_ERROR, err);
    }
    if (response) {
      try {
        return await OrderItems.update({ ...data }, { where: { id } });
      } catch (err) {
        throw new HttpError('Failed to update OrderItems ', StatusCodes.INTERNAL_SERVER_ERROR, err);
      }
    } else {
      throw new HttpError("Couldn't get Order details", StatusCodes.INTERNAL_SERVER_ERROR, id);
    }
  };

  deleteOrderItems = async (id: any) => {
    let response;
    try {
      response = await this.getOrderItems(id);
    } catch (err) {
      throw new HttpError('Failed to update OrderItems ', StatusCodes.INTERNAL_SERVER_ERROR, err);
    }
    if (response) {
      try {
        return await OrderItems.destroy({ where: { id } });
      } catch (err) {
        throw new HttpError('Failed to update Order Items', StatusCodes.INTERNAL_SERVER_ERROR, err);
      }
    } else {
      throw new HttpError("Couldn't get Order details", StatusCodes.INTERNAL_SERVER_ERROR, id);
    }
  };

  getLeftItem = async (id: string) => {
    try {
      const sequelize = await dbConnection();
      return await OrderItems.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('no_of_items')), 'itemOrdered']],
        where: {
          item_id: id,
          created_at: {
            [Op.between]: [moment().startOf('day').format(), moment().endOf('day').format()]
          }
        }
      });
    } catch (err) {
      throw new HttpError('Failed to get Item', StatusCodes.INTERNAL_SERVER_ERROR, err);
    }
  };
}
