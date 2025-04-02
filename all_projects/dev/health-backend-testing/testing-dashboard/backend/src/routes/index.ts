import { Router } from 'express';
import sourceSystemRoutes from './sourceSystemRoutes';
import schedulerRoutes from './schedulerRoutes';
import reportRoutes from './reportRoutes';
import userRoutes from './userRoutes';
import facilitiesRouter from './facilitiesRouter';
import logRouter from './logRouter';

const router = Router();

export default (): Router => {
    sourceSystemRoutes(router);
    schedulerRoutes(router);
    reportRoutes(router);
    userRoutes(router);
    facilitiesRouter(router);
    logRouter(router);

    return router;
}