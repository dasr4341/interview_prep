import express from 'express';
import CategoryController from '../controllers/CategoryController';
import fetchUser from '../middleware/fetchUser';

const categoryRouter = express.Router();
const categoryController = new CategoryController();

categoryRouter.get('/', fetchUser, categoryController.GetCategories);

categoryRouter.get('/:id', fetchUser, categoryController.GetCategory);

categoryRouter.post('/', fetchUser, categoryController.CreateCategory);

categoryRouter.get('/sub/all', fetchUser, categoryController.GetSubCategories);

categoryRouter.put('/:id', fetchUser, categoryController.UpdateCategory);

categoryRouter.delete('/:id', fetchUser, categoryController.DeleteCategory);

export default categoryRouter;
