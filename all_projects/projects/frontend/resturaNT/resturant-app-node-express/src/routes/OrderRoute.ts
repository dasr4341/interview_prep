import express from 'express';
import OrderController from '../controllers/OrderController';
import fetchUser from '../middleware/fetchUser';

const orderRouter = express.Router();
const orderController = new OrderController();

// Get all users
orderRouter.get('/', fetchUser, orderController.GetAllOrders);
orderRouter.get('/:orderStatus', fetchUser, orderController.GetOrdersByStatus);

orderRouter.get('/getOrder/:id', orderController.GetOrderById);

orderRouter.post('/', fetchUser, orderController.CreateOrder);

orderRouter.put('/:id', fetchUser, orderController.UpdateOrder);

orderRouter.put('/status/:id', fetchUser, orderController.UpdateOrderStatus);

orderRouter.delete('/:id', fetchUser, orderController.DeleteOrder);

export default orderRouter;
