import { Router } from 'express';
import { schedulerController } from '../modules/controller/scheduler/schedulerContorller';

export default (router: Router) => {
    router.post('/scheduler/list', schedulerController)
}
