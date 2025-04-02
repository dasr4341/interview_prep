import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import ValidationError from '../error/ValidationError';
import OrderDetailsService from '../services/OrderItemService';
import OrderSevice from '../services/OrderService';
import OrderValidation from '../validation/OrderValidation';
import HttpError from '../error/HttpError';
import ItemService from '../services/ItemService';

export default class OrderController {
  // GetOrdersDetails = async (req: Request, res: Response) => {
  //   const service = new OrderDetailsService();
  //   const allOrders = await service.getAllOrderItems();
  //   return res.status(200).send({
  //     message: 'Retrive all Order details',
  //     data: allOrders,
  //   });
  // };

  // CreateOrderDetails = async (req: Request, res: Response) => {
  //   const service = new OrderDetailsService();
  //   const Order = await service.addOrderItems(req.body.items);
  //   return res.status(201).send({
  //     message: 'Create Order',
  //     data: Order,
  //   });
  // };

  // GetParticularOrderDetails = async (req: Request, res: Response) => {
  //   const service = new OrderDetailsService();
  //   const { id } = req.params;
  //   const Order = await service.getOrderItems(id);
  //   return res.status(200).send({
  //     message: 'Retrieve Order details',
  //     data: Order,
  //   });
  // };

  // UpdateOrderDetails = async (req: Request, res: Response) => {
  //   const service = new OrderDetailsService();
  //   const { id } = req.params;
  //   const Order = await service.updateOrderItems(id, req.body);
  //   return res.status(200).send({
  //     message: 'Update Order',
  //     data: Order,
  //   });
  // };

  GetLeftItemsHelper = async (itemId: string) => {
    const service = new OrderDetailsService();
    const itemService = new ItemService();
    const checkIsItemIdValid = await itemService.getItem(itemId);
    if (!checkIsItemIdValid) {
      return 0;
    }
    const noOfItemsOrdered: any = await service.getLeftItem(itemId);
    const maxLimitOfOrder: any = await itemService.getItemMaxLimit(itemId);

    const maxLimit = maxLimitOfOrder ? parseInt(maxLimitOfOrder.item_limit, 10) : 0;

    let leftOver = 0;
    if (noOfItemsOrdered[0].dataValues.itemOrdered) {
      leftOver = maxLimit - parseInt(noOfItemsOrdered[0].dataValues.itemOrdered, 10);
      return leftOver;
    }
    return maxLimit;
  };

  GetLeftItems = async (req: Request, res: Response, next: any) => {
    try {
      const { id } = req.params;
      const { error } = OrderValidation.Id.validate(id, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Improper Fields',
          StatusCodes.BAD_REQUEST,
          error.details.map((e) => e.message.replace(/"/gi, ''))
        );
      } else {
        const leftOver = await this.GetLeftItemsHelper(id);
        return res.status(200).send({
          data: leftOver,
          success: true,
          message: 'Left over items',
        });
      }
    } catch (err) {
      next(err);
    }
  };

  UpdateNoOfOrderItems = async (req: Request, res: Response, next: any) => {
    try {
      const data = {
        id: req.params.id,
        no_of_items: req.body.no_of_items,
      };
      const { error } = OrderValidation.updateNoOfItems.validate(data, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Improper Fields',
          StatusCodes.BAD_REQUEST,
          error.details.map((e) => e.message.replace(/"/gi, ''))
        );
      } else {
        const service = new OrderDetailsService();
        const { id } = data;
        let result = {
          message: 'Please try after sometime ',
          success: false,
          data: null,
        };
        let status = StatusCodes.INTERNAL_SERVER_ERROR;

        const Order: number[] = await service.updateNoOfOrderItems(id, req.body);
        if (Order && Order[0] === 1) {
          result = {
            message: 'Item Updated',
            success: true,
            data: null,
          };
          status = StatusCodes.OK;
        }
        return res.status(status).json(result);
      }
    } catch (error) {
      return next(error);
    }
  };

  DeleteOrderDetails = async (req: Request, res: Response, next: any) => {
    try {
      const service = new OrderDetailsService();
      const oService = new OrderSevice();
      const { id, orderId } = req.params;
      let result = { message: 'Items cannot be removed', data: null, success: false };

      let status = StatusCodes.INTERNAL_SERVER_ERROR;
      let orderDeleteStatus = {
      };
      const data = {
        id,
        order_id: orderId,
      };
      const { error } = OrderValidation.deleteItems.validate(data, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Improper Fields',
          StatusCodes.BAD_REQUEST,
          error.details.map((e) => e.message.replace(/"/gi, ''))
        );
      } else {
        let output;
        try {
          output = await service.deleteOrderItems(id);
        } catch (err) {
          throw new HttpError('Failed to delete order', StatusCodes.INTERNAL_SERVER_ERROR, err);
        }

        if (output === 1) {
          result = {
            message: 'Items removed successfully',
            data: null,
            success: true,
          };
          status = StatusCodes.OK;
          // in case all the order items are removed the respective order will also be removed

          // check is there any orderItems exists under this order ID
          let items;
          try {
            items = await service.getOrderItemsByOrderId(orderId);
          } catch (err) {
            throw new HttpError('Failed to get Order data', StatusCodes.INTERNAL_SERVER_ERROR, err);
          }
          if (!items || !items.length) {
            let oResult;

            try {
              oResult = await oService.deleteOrder(orderId);
            } catch (err) {
              throw new HttpError('Failed to get Order data', StatusCodes.INTERNAL_SERVER_ERROR, err);
            }
            if (oResult) {
              orderDeleteStatus = {
                message: 'Order Deleted',
                success: true,
              };
            }
          }
        }
        return res.status(status).send({
          result,
          orderDeleteStatus,
        });
      }
    } catch (err) {
      return next(err);
    }
  };

  getAllItemsLeftOverDetails = async (req: Request, res: Response, next: any) => {
    try {
      const itemService = new ItemService();
      const response = await itemService.getDefaultAllItems();

      const allItemsId = await Promise.all(response.map(async (element: any) => {
        const leftOverQuantity = await this.GetLeftItemsHelper(element.id);
        return {
          itemId: element.id,
          leftOver: leftOverQuantity,
        };
      }));

      return res.status(StatusCodes.OK).json({
        message: 'All items left over details',
        success: true,
        data: allItemsId
      });
    } catch (error) {
      next(error);
    }
  };
}
