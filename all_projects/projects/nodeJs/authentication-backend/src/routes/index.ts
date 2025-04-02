import { Router } from 'express';
import useRouter from './useRoutes.js';

const router = Router();

export default (): Router => {
    useRouter(router);
    return router;
}