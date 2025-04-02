import { Router } from 'express';
import { userResponseController } from '../modules/controller/users/userController';
import { activePatientCountController } from '../modules/controller/users/activePatientCountController';

export default (router: Router) => {
    router.post('/users/list', userResponseController);
    router.post('/users/active-patient', activePatientCountController);
}