import { Router } from "express";
import { getAllUser, login, register, deleteUser, getSingleUser } from '../controllers/userController.js';

export default (router: Router) => {
    router.post('/auth/register', register);
    router.get('/users', getAllUser);
    router.get('/auth/login', login);
    router.delete('/delete/user/:id', deleteUser);
    router.get('/get/user/:id', getSingleUser);
}