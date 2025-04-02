import express from 'express';
import UserController from '../controllers/UserController';
import fetchUser from '../middleware/fetchUser';

const userRouter = express.Router();
const userController = new UserController();

// getAll user
userRouter.post('/search-user', fetchUser, userController.searchUser);

// forget password endpoints
userRouter.post('/forget-password', userController.forgetPassword);
userRouter.put('/forget-password/new-password', userController.newPassword);

// profile endpoints
userRouter.get('/profile', fetchUser, userController.getProfile);
userRouter.put('/profile', fetchUser, userController.updateProfile);

// reset password endpoints
userRouter.put('/reset-password', fetchUser, userController.resetPassword);

// login endpoints
userRouter.post('/login', userController.login);

// signup endpoints
userRouter.post('/signup', userController.signup);
userRouter.post('/signup-user', userController.signupUser);

export default userRouter;
