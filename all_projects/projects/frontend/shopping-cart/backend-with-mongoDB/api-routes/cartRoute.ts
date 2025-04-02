import { Router } from "express";
import CartController from "../controller/cartController.js";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.get('/getAllProducts', cartController.getAllProducts);
cartRouter.post('/addToCart', cartController.addToCart);
cartRouter.delete('/removeAllProducts', cartController.removeAllProducts);
cartRouter.put('/updateCartItem/:productId', cartController.updateCartItemQuantityById);

export default cartRouter;