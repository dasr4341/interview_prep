import express from 'express';
import ItemController from '../controllers/ItemController';
import upload from '../multer/multer';
import fetchUser from '../middleware/fetchUser';

const itemRouter = express.Router();
const itemController = new ItemController();

itemRouter.get('/', fetchUser, itemController.GetItems);

itemRouter.get('/:id', fetchUser, itemController.GetItem);

itemRouter.post('/', fetchUser, upload.single('img'), itemController.CreateItem);

itemRouter.put('/:id', fetchUser, upload.single('img'), itemController.UpdateItem);

itemRouter.delete('/:id', fetchUser, itemController.DeleteItem);

export default itemRouter;
