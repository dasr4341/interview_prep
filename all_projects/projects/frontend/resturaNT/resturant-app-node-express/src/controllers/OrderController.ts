import sgMail from '@sendgrid/mail';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import OrderService from '../services/OrderService';
import OrderValidation from '../validation/OrderValidation';
import ValidationError from '../error/ValidationError';
import HttpError from '../error/HttpError';
import ItemService from '../services/ItemService';
import UserService from '../services/UserService';
import config from '../config/config';
import orderConfirmation from '../utils/OrderConfirmationTemplate';
import orderConfirmationEmailBody from '../public/orderConfirmationEmailBody';

export interface OrderDetailsItemsInterface {
  item_price: number;
  no_of_items: number;
  item_id: number;
}

export default class OrderController {
  GetAllOrders = async (req: Request, res: Response, next: any) => {
    try {
      const service = new OrderService();
      const allOrders = await service.getAllOrder();
      return res.status(StatusCodes.OK).json({
        message: 'Retrieve all Orders',
        data: allOrders,
        success: true,
      });
    } catch (err) {
      return next(err);
    }
  };

  GetOrdersByStatus = async (req: Request, res: Response, next: any) => {
    try {
      const { orderStatus } = req.params;
      const { error } = OrderValidation.orderStatus.validate(orderStatus, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Improper Fields',
          StatusCodes.BAD_REQUEST,
          error.details.map((e) => e.message.replace(/"/gi, ''))
        );
      } else {
        const service = new OrderService();
        const allOrders = await service.getOrderByStatus(orderStatus);
        return res.status(StatusCodes.OK).json({
          message: 'Retrieve Orders By Status',
          data: allOrders,
          success: true,
        });
      }
    } catch (err) {
      return next(err);
    }
  };

  CreateOrder = async (req: Request, res: Response, next: any) => {
    try {
      const orderRequestData = req.body.order;
      const itemRequestData = req.body?.items;
      const OrderDetailsArray: OrderDetailsItemsInterface[] = [];

      const service = new OrderService();
      const itemsService = new ItemService();

      // order validation
      const { error } = OrderValidation.createSchema.validate(orderRequestData, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Improper Fields',
          StatusCodes.BAD_REQUEST,
          error.details.map((e) => e.message.replace(/"/gi, ''))
        );
      }
      // order items validation
      const itemsValidationError = OrderValidation.itemsCreateSchema.validate(itemRequestData, {
        abortEarly: false,
      }).error;
      if (itemsValidationError) {
        // if validation failed
        throw new ValidationError(
          'Improper Item Field',
          StatusCodes.BAD_REQUEST,
          itemsValidationError.details.map((e) => e.message.replace(/"/gi, ''))
        );
      }
      let grandTotal = 0;
      await Promise.all(
        itemRequestData.map(async (element: any, key: number) => {
          if (itemRequestData[key]) {
            const data = await itemsService.getItem(element.item_id);
            if (data) {
              OrderDetailsArray.push({
                item_price: data?.price,
                no_of_items: element.no_of_items,
                item_id: element.item_id,
              });
              grandTotal += (Number(element.no_of_items) * Number(data?.price));
            } else {
              throw new HttpError('Failed to get item details', StatusCodes.BAD_REQUEST, null);
            }
          }
          return element;
        })
      );
      // creating order :-
      const addOrderResponse = await service.addOrder(orderRequestData, OrderDetailsArray);
      if (addOrderResponse) {
        // send a mail to the user
        // orderRequestData.user_id - > user id
        // get the email using this user_id
        const userService = new UserService();
        const userData = await userService.findOneUserByPk(orderRequestData.user_id);
        // sending the mail
        if (userData) {
          sgMail.setApiKey(String(config.SEND_GRID_API_KEY));
          const orderStatusUserLink = `${config.ORDER_STATUS_USER_FRONTEND_URL}/${addOrderResponse.id}`;
          const message = orderConfirmation(
            userData?.email,
            config.COMPANY_NAME,
            config.SENDER_EMAIL,
            config.ORDER_CONFIRMATION_EMAIL_SUBJECT,
            orderConfirmationEmailBody(addOrderResponse.id, OrderDetailsArray.length, grandTotal, orderStatusUserLink)
          );
          await sgMail.send(message);
        }
      }
      return res.status(StatusCodes.CREATED).send({
        message: 'Order Has been successfully created',
        data: null,
        success: true,
      });
    } catch (err) {
      return next(err);
    }
  };

  GetOrderById = async (req: Request, res: Response, next: any) => {
    try {
      // validation
      const { error } = OrderValidation.Id.validate(req.params.id, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Improper Fields',
          StatusCodes.BAD_REQUEST,
          error.details.map((e) => e.message.replace(/"/gi, ''))
        );
      } else {
        const service = new OrderService();
        const { id } = req.params;
        const Order = await service.getOrderById(id);
        if (Order) {
          return res.status(StatusCodes.OK).send({
          message: 'Retrieve a Order detail',
          data: Order,
          success: true,
        });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: 'Order Not Found',
          data: null,
          success: false,
        });
      }
    } catch (err) {
      return next(err);
    }
  };

  UpdateOrder = async (req: Request, res: Response) => {
    const service = new OrderService();
    const { id } = req.params;
    const Order = await service.updateOrder(id, req.body);
    return res.status(200).send({
      message: 'Update Order',
      data: Order,
    });
  };

  DeleteOrder = async (req: Request, res: Response, next: any) => {
    try {
      const { error } = OrderValidation.Id.validate(req.params.id, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Improper Fields',
          StatusCodes.BAD_REQUEST,
          error.details.map((e) => e.message.replace(/"/gi, ''))
        );
      } else {
        const service = new OrderService();
        const { id } = req.params;
        await service.deleteOrder(id);
        return res.status(200).send({
          message: 'Delete Order',
          success: true,
          data: null,
        });
      }
    } catch (err) {
      return next(err);
    }
  };

  UpdateOrderStatus = async (req: Request, res: Response, next: any) => {
    try {
      const service = new OrderService();
      const { id } = req.params;
      let result = {
        message: 'Order Id does not exist !! ',
        data: null,
        success: false,
      };
      let status = StatusCodes.INTERNAL_SERVER_ERROR;
      const data = {
        id,
        ...req.body,
      };
      //   check if the order exist or not
      const { error } = OrderValidation.updateStatus.validate(data, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Improper Fields',
          StatusCodes.BAD_REQUEST,
          error.details.map((e) => e.message.replace(/"/gi, ''))
        );
      } else {
        let checkResult;
        try {
          checkResult = await service.getOrderById(id);
        } catch (err) {
          throw new HttpError('cannot get the order', StatusCodes.BAD_REQUEST, id);
        }

        if (checkResult) {
          let updateStatus: number[];
          try {
            updateStatus = await service.updateOrderStatus(id, req.body);
          } catch (err) {
            throw new HttpError('cannot update the order', StatusCodes.BAD_REQUEST, id);
          }

          if (updateStatus && updateStatus[0] === 1) {
            // update success
            let message = 'Order Confirmed ';
            if (data.status === 'ready') {
              message = 'Order Prepared';
            } else if (data.status === 'delivered') {
              message = 'Order Delivered';
            }
            result = {
              message,
              data: null,
              success: true,
            };

            status = StatusCodes.OK;
          } else {
            result = {
              message: 'Order not placed',
              data: null,
              success: false,
            };
          }
        }
        return res.status(status).send(result);
      }
    } catch (err) {
      return next(err);
    }
  };
}
