import express from 'express';
import OrderItemsController from '../controllers/OrderItemsController';
import fetchUser from '../middleware/fetchUser';

const orderItemsRouter = express.Router();
const orderItemsontroller = new OrderItemsController();

// orderItemsRouter.get('/', orderItemsontroller.GetOrdersDetails);
// orderItemsRouter.get('/:id', orderItemsontroller.GetParticularOrderDetails);
// orderItemsRouter.post('/', orderItemsontroller.CreateOrderDetails);
// orderItemsRouter.put('/:id', orderItemsontroller.UpdateOrderDetails);
// **** above api are not in use ****

// to get the left over quantity of items
orderItemsRouter.post('/GetLeftOverItemsDetails/:id', fetchUser, orderItemsontroller.GetLeftItems);

// to update the no of items
orderItemsRouter.put('/noOfItems/:id', fetchUser, orderItemsontroller.UpdateNoOfOrderItems);

// to del the orderItem, and
// if the corresponding order have no orderItem then this api will also delete the corresponding order
orderItemsRouter.delete('/:id/:orderId', fetchUser, orderItemsontroller.DeleteOrderDetails);

// get the left over quantity details for all items
orderItemsRouter.get('/GetAllItemsLeftOverDetails', fetchUser, orderItemsontroller.getAllItemsLeftOverDetails);

export default orderItemsRouter;
